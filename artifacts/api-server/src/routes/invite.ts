import { createClient } from "@supabase/supabase-js";
import { Router } from "express";

const router = Router();

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin credentials not configured");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

router.post("/invite", async (req, res) => {
  const { email, memberName, inviterName, redirectTo } = req.body as {
    email?: string;
    memberName?: string;
    inviterName?: string;
    redirectTo?: string;
  };

  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "A valid email address is required" });
    return;
  }

  try {
    const admin = getAdminClient();

    // If already a confirmed user, skip the invite (they just need to sign in)
    const { data: existingUser } = await admin.auth.admin.listUsers();
    const alreadyExists = (existingUser?.users ?? []).some(
      (u: { email?: string; email_confirmed_at?: string | null }) =>
        u.email === email.toLowerCase() && !!u.email_confirmed_at
    );

    if (alreadyExists) {
      res.json({ success: true, alreadyOnApp: true });
      return;
    }

    const inviteOptions: { redirectTo?: string; data?: Record<string, string> } = {
      data: {
        invited_by: inviterName ?? "Your family",
        family_member_name: memberName ?? "",
      },
    };

    if (redirectTo) inviteOptions.redirectTo = redirectTo;

    const { error } = await admin.auth.admin.inviteUserByEmail(
      email.toLowerCase(),
      inviteOptions
    );

    if (error) {
      req.log.error({ err: error, email }, "Supabase invite error");
      // "User already registered" is not a real failure — they just need to sign in
      if (error.message?.toLowerCase().includes("already")) {
        res.json({ success: true, alreadyOnApp: true });
        return;
      }
      res.status(500).json({ error: error.message ?? "Failed to send invite" });
      return;
    }

    req.log.info({ email, invitedBy: inviterName }, "Invite sent");
    res.json({ success: true, alreadyOnApp: false });
  } catch (err) {
    req.log.error({ err }, "Invite route error");
    res.status(500).json({ error: "Failed to send invite email" });
  }
});

export default router;
