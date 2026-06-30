import model from "../config/gemini.js";

// ── IMPROVED PROMPT ──────────────────────────────────────
// Original prompt only asked for skill matching. Improvements:
// 1. Added experience-level signal (internship readiness, not just keyword overlap)
// 2. Added explicit skill-importance weighting instruction so "React" (core req)
//    counts more than a nice-to-have like "Figma"
// 3. Added a strengths field — gives students something positive, not just gaps
// 4. Tightened the suggestion instruction to be actionable, not generic
// 5. Added a fallback instruction for resumes with very little content
export const generateAIMatch = async (resumeText, jobDescription) => {
  const prompt = `
You are an AI resume matching system for an internship platform. Analyze the
candidate's resume against the job description and return a structured,
honest assessment — not a generic one.

Return ONLY valid JSON. No markdown, no explanation, no extra text.

Required JSON format:
{
  "score": number,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "suggestion": ""
}

Scoring rules:
- score is 0-100, weighted by how critical each required skill is to the role
  (a core required skill like "React" for a React internship matters far more
  than a minor nice-to-have).
- Do not give a high score purely because many keywords overlap — judge
  actual relevance and depth (e.g. "built 3 React projects" outweighs a bare
  mention of "React" in a skills list).
- If the resume shows clear hands-on project experience relevant to the role,
  weight that above just listing technologies.

Field rules:
- matchedSkills: skills/technologies from the job description that the resume
  demonstrates (not just lists) — max 10, most relevant first.
- missingSkills: important skills from the job description not evidenced in
  the resume — max 6, most critical first.
- strengths: 1-3 short phrases on what makes this candidate stand out for
  this specific role (e.g. "Strong portfolio of full-stack projects"). Leave
  empty array if resume has insufficient detail.
- suggestion: one specific, actionable sentence the student can act on this
  week (e.g. "Add a project demonstrating state management with Redux" -- not
  vague advice like "improve your skills").

If the resume text is extremely short or empty, return a low score (under 20)
and set suggestion to explain that the resume needs more detail to evaluate.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  // Retry on transient overload (503) — Gemini's shared endpoints get
  // temporarily saturated; a short backoff usually succeeds on retry.
  const MAX_RETRIES = 3;
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      let responseText = result.response.text().trim();

      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.log("Gemini raw response (no JSON found):", responseText);
        throw new Error("AI did not return valid JSON");
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (parseErr) {
        console.log("Gemini raw response (JSON.parse failed):", jsonMatch[0]);
        throw parseErr;
      }

      return {
        score: typeof parsed.score === "number" ? Math.max(0, Math.min(100, parsed.score)) : 0,
        matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills.slice(0, 10) : [],
        missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills.slice(0, 6) : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
        suggestion: typeof parsed.suggestion === "string" ? parsed.suggestion : "",
      };
    } catch (err) {
      lastError = err;
      const isRetryable = err?.status === 503 || err?.status === 429;

      if (isRetryable && attempt < MAX_RETRIES) {
        const delayMs = attempt * 1500; // 1.5s, 3s, 4.5s
        console.log(`Gemini overloaded (attempt ${attempt}/${MAX_RETRIES}), retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      // Not retryable, or out of retries — surface a clean error
      if (err?.status === 503) {
        throw new Error("AI matching service is temporarily busy. Please try again in a moment.");
      }
      // Re-throw the actual error (with logged raw response above) instead
      // of masking every failure as the same generic message — makes
      // debugging future issues much faster.
      throw err;
    }
  }

  throw lastError;
};