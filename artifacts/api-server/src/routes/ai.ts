import Groq from "groq-sdk";
import { Router } from "express";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

const router = Router();

router.post("/ai/meals", async (req, res) => {
  try {
    const { preferences = [], inventory = [], familySize = 4, nutritionalGoals = [], mealType = "lunch" } = req.body;

    const prefsText = preferences.length > 0 ? preferences.join(", ") : "no specific preferences";
    const goalsText = nutritionalGoals.length > 0 ? nutritionalGoals.join(", ") : "balanced nutrition";
    const inventoryText = inventory.slice(0, 20).join(", ");

    const mealCount = mealType === "weekly" ? "7 different meals (one for each day)" : "3 different meal options";
    const mealTypeLabel = mealType === "weekly" ? "diverse weekly meals" : `${mealType} options`;

    const prompt = `You are a nutritionist specializing in Indian home cooking for urban Indian families.

Generate ${mealCount} for ${mealTypeLabel} for a family of ${familySize}.

Dietary preferences: ${prefsText}
Available pantry ingredients: ${inventoryText}
Nutritional goals: ${goalsText}

Requirements:
- Use authentic Indian recipes with Hindi names where applicable
- Prioritize using available pantry ingredients
- Make meals practical for busy working parents
- Include a mix of regions (North Indian, South Indian, etc.) when relevant
- Ensure child-friendly options

Respond with valid JSON only, no markdown, no extra text. Use this exact format:
{
  "meals": [
    {
      "name": "Palak Dal",
      "nameHindi": "पालक दाल",
      "description": "Protein-rich spinach lentil soup, perfect for growing children",
      "ingredients": ["spinach", "toor dal", "tomatoes", "garlic", "turmeric"],
      "prepTime": "25 min",
      "nutritionHighlights": "High protein, Iron rich",
      "servings": 4
    }
  ],
  "nutritionSummary": "These meals together provide a balanced mix of proteins, complex carbs, and micronutrients suitable for all ages.",
  "tips": "Batch cook the dal on weekends and refrigerate for up to 3 days."
}`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        { role: "system", content: "You are a helpful nutritionist. Always respond with valid JSON only, no markdown code blocks, no extra text." },
        { role: "user", content: prompt },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Could not parse AI response" });
      return;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "AI meal planning error");
    res.status(500).json({ error: "Failed to generate meal suggestions" });
  }
});

router.post("/ai/firstaid", async (req, res) => {
  const { condition, childAge, severity, additionalInfo } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const prompt = `You are a helpful medical information assistant for parents in India. Provide clear, actionable first aid guidance for children.

Condition: ${condition}
Child's age: ${childAge}
Perceived severity: ${severity}
${additionalInfo ? `Additional context: ${additionalInfo}` : ""}

Important:
- Always start with emergency indicators — tell parents when to call 108 or go to hospital immediately
- Provide step-by-step first aid instructions
- Use simple, reassuring language appropriate for a worried parent
- Reference common Indian household remedies where medically appropriate
- End with "When to seek medical attention" section
- Do NOT diagnose — always recommend consulting a doctor

Format your response clearly with headers and numbered steps.`;

    const stream = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 4096,
      stream: true,
      messages: [
        { role: "system", content: "You are a helpful medical information assistant for parents in India. Provide clear, reassuring, and actionable guidance." },
        { role: "user", content: prompt },
      ],
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
      if (text) {
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "AI first aid error");
    res.write(`data: ${JSON.stringify({ error: "Failed to get AI guidance" })}\n\n`);
    res.end();
  }
});

export default router;
