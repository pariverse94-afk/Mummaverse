import { Router } from "express";

const router = Router();

router.get("/delete-account", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Request Account Deletion — Pariverse</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #FFF8F0;
      color: #1a1a1a;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #fff;
      border-radius: 20px;
      padding: 40px 36px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
    }
    .logo-circle {
      width: 44px; height: 44px; border-radius: 50%;
      background: #E07B39;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
    }
    .logo-name { font-size: 22px; font-weight: 700; color: #1a1a1a; }
    .logo-sub { font-size: 13px; color: #888; }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #C44B2B; }
    p { font-size: 15px; line-height: 1.65; color: #444; margin-bottom: 16px; }
    .what-deleted {
      background: #FFF3EE;
      border-left: 3px solid #E07B39;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 24px;
    }
    .what-deleted ul { padding-left: 18px; }
    .what-deleted li { font-size: 14px; color: #555; line-height: 1.7; }
    .btn {
      display: block;
      width: 100%;
      background: #E07B39;
      color: #fff;
      text-decoration: none;
      text-align: center;
      padding: 15px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 14px;
    }
    .note { font-size: 13px; color: #888; text-align: center; }
    .divider { border: none; border-top: 1px solid #f0e8e0; margin: 24px 0; }
    .footer { font-size: 12px; color: #aaa; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <div class="logo-circle">🏠</div>
      <div>
        <div class="logo-name">Pariverse</div>
        <div class="logo-sub">Family App</div>
      </div>
    </div>

    <h1>Request Account Deletion</h1>
    <p>You can request deletion of your Pariverse account and all associated data by sending us an email. We will process your request within <strong>30 days</strong>.</p>

    <div class="what-deleted">
      <p style="font-weight:600; margin-bottom:8px; color:#1a1a1a;">What will be deleted:</p>
      <ul>
        <li>Your profile (name, family name, email)</li>
        <li>Family members and chore data</li>
        <li>Mom's Corner posts and saved content</li>
        <li>All meal plans associated with your account</li>
        <li>Authentication records</li>
      </ul>
    </div>

    <a class="btn" href="mailto:pariverse94@gmail.com?subject=Account%20Deletion%20Request&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20the%20deletion%20of%20my%20Pariverse%20account%20and%20all%20associated%20data.%0A%0AEmail%20address%20registered%3A%20%5BYour%20email%20here%5D%0A%0AThank%20you.">
      Send Deletion Request Email
    </a>
    <p class="note">Tapping above will open your email app with a pre-filled message to pariverse94@gmail.com</p>

    <hr class="divider" />
    <p class="footer">Pariverse &bull; pariverse94@gmail.com &bull; Governed by Indian law</p>
  </div>
</body>
</html>`);
});

export default router;
