import process from "process"
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { InferenceClient } from "@huggingface/inference";

dotenv.config();

console.log("🚀 Backend file loaded");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is connected" });
});

// 🔴 HARD STOP if token missing
if (!process.env.HF_ACCESS_TOKEN) {
  console.error("❌ HF_ACCESS_TOKEN is missing");
  process.exit(1);
}

console.log("✅ HF_ACCESS_TOKEN loaded");

const hf = new InferenceClient(process.env.HF_ACCESS_TOKEN);

app.post("/api/recipe", async (req, res) => {
  const { ingredients } = req.body;

  res.json({
    recipe: `Mock recipe generated using: ${ingredients}`
  });


  try {
    const { ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({ error: "Ingredients missing" });
    }

    console.log("🧾 Ingredients:", ingredients);

    const prompt = `
You are a helpful cooking assistant.
Create a simple recipe using the following ingredients:
${ingredients}
`;

    const response = await hf.textGeneration({
      model: "bigscience/bloomz-560m",
      inputs: prompt,
      parameters: {
        max_new_tokens: 400,
        temperature: 0.7
      }
    });

    res.json({
      recipe: response.generated_text
    });

  } catch (err) {
    console.error("❌ Inference error:", err);
    res.status(500).json({
      error: err.message || "Inference failed"
    });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});