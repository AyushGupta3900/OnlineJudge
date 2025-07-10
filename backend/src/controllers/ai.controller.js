import { AppError } from "../utils/AppError.js";
import { TryCatch } from "../utils/TryCatch.js";
import fetch from "node-fetch";
import Problem from "../models/Problem.js";

export const getAiReview = TryCatch(async (req, res) => {
  const { code, language, problemId } = req.body;

  if (!code || !language) {
    throw new AppError("Code and language are required", 400);
  }

  let problemContext = "";
  if (problemId) {
    const problem = await Problem.findById(problemId);
    if (problem) {
      problemContext = `Here is the problem description for context:\nTitle: ${problem.title}\nDescription: ${problem.description}\nConstraints: ${problem.constraints?.join(", ") || "N/A"}`;
    }
  }

  const prompt = `
You are a helpful code reviewer AI. 
Review the following ${language.toUpperCase()} code submitted for an algorithm/data-structure problem.
Point out potential improvements, coding style issues, performance issues, and correctness if possible.
Be concise but clear.

${problemContext ? problemContext + "\n\n" : ""}
Here is the submitted code:
\`\`\`${language}
${code}
\`\`\`
Provide your review below:
`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new AppError("Gemini API key not configured", 500);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new AppError(
      `Gemini API error: ${errorData.error?.message || response.statusText}`,
      500
    );
  }

  const data = await response.json();
  let review = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!review) {
    throw new AppError("Failed to generate AI review", 500);
  }

  // Remove ```language and ```
  review = review.replace(/^```[\s\S]*?\n/, "").replace(/```$/, "").trim();

  res.status(200).json({
    success: true,
    review,
  });
});

export const generateBoilerplate = TryCatch(async (req, res) => {
  const { language, problemId } = req.body;

  if (!language || !problemId) {
    throw new AppError("Language and problemId are required", 400);
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  const problemContext = `Here is the problem description:\nTitle: ${problem.title}\nDescription: ${problem.description}\nConstraints: ${problem.constraints?.join(", ") || "N/A"}`;

  const prompt = `
You are a helpful competitive programming assistant.

Write a clean, idiomatic, minimal **${language.toUpperCase()}** boilerplate code that sets up the input and output structure for solving the following problem.

⚠️ Notes:
- Include proper input reading logic (e.g., reading from stdin).
- Define the main function or equivalent.
- Include comments for where to implement the logic.
- Do NOT solve the problem, just create a ready-to-use skeleton.

${problemContext}

Output only the code, nothing else.
`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new AppError("Gemini API key not configured", 500);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new AppError(
      `Gemini API error: ${errorData.error?.message || response.statusText}`,
      500
    );
  }

  const data = await response.json();
  let boilerplate = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!boilerplate) {
    throw new AppError("Failed to generate boilerplate", 500);
  }

  // Remove ```language and ```
  boilerplate = boilerplate.replace(/^```[\s\S]*?\n/, "").replace(/```$/, "").trim();

  res.status(200).json({
    success: true,
    boilerplate,
  });
});

export const generateTestCases = TryCatch(async (req, res) => {
  const { problemId } = req.body;

  if (!problemId) {
    throw new AppError("problemId is required", 400);
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  const problemContext = `Here is the problem description:\nTitle: ${problem.title}\nDescription: ${problem.description}\nConstraints: ${problem.constraints?.join(", ") || "N/A"}`;

  const prompt = `
You are a competitive programming test case generator assistant.

✅ Your task:
- Generate at least **7 diverse test cases** for the given problem.
- Cover:
  - Typical/normal cases.
  - Edge cases (e.g., minimum input, maximum input, empty input).
  - Corner cases (unexpected but valid scenarios).
  - Large inputs (stress test the solution).
- Each test case should have a clearly labeled **Input** and **Expected Output**, written as text.
- Format all test cases clearly, one after another.
- Enclose each test case in a proper code block (\`\`\`) so it can be displayed nicely.
- Do not explain anything, only output the test cases.

📄 Problem:
${problemContext}

Output only the test cases, nothing else.
`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new AppError("Gemini API key not configured", 500);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new AppError(
      `Gemini API error: ${errorData.error?.message || response.statusText}`,
      500
    );
  }

  const data = await response.json();
  let testCases = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!testCases) {
    throw new AppError("Failed to generate test cases", 500);
  }

  res.status(200).json({
    success: true,
    testCases,
  });
});