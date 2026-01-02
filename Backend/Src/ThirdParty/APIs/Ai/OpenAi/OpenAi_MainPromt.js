const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const payload = {
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: `
You will receive a Tweet's content and context.

Your response MUST follow this exact format:

One-sentence result: <one concise sentence>
Key words * <keyword 1> * <keyword 2> * <keyword 3>

Rules:
- Exactly ONE sentence after "One-sentence result:"
- Use "Key words *" format (asterisks, not commas)
- No opinions
- No extra text
      `.trim(),
    },
    {
      role: "user",
      content: `
Neuralink will start high-volume production of brain-computer interface devices and move to a streamlined, almost entirely automated surgical procedure in 2026. Device threads will go through the dura without removing it.
      `.trim(),
    },
  ],
};

module.exports = { OPENAI_API_KEY, payload };
