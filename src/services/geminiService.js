import model
from "../config/gemini.js";




// Generate AI Match
export const generateAIMatch =
  async (
    resumeText,
    jobDescription
  ) => {

    // AI Prompt
    const prompt = `

You are an AI resume matching system.

Analyze the candidate resume against the job description.

Return ONLY valid JSON.

Do NOT include markdown.
Do NOT include explanation.
Do NOT include extra text.

Required JSON format:

{
  "score": number,
  "matchedSkills": [],
  "missingSkills": [],
  "suggestion": ""
}

Rules:
- score must be between 0 and 100
- matchedSkills should contain relevant matching skills
- missingSkills should contain important missing skills
- suggestion should be one short improvement sentence

Resume:
${resumeText}

Job Description:
${jobDescription}

`;


    // Generate AI Response
    const result =
      await model.generateContent(
        prompt
      );


    // Extract Raw Response
    let responseText =
      result.response
        .text()
        .trim();


    // Remove Markdown Wrappers
    responseText =
      responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();


    // Extract JSON Portion
    const jsonMatch =
      responseText.match(
        /\{[\s\S]*\}/
      );


    if (!jsonMatch) {

      throw new Error(
        "AI did not return valid JSON"
      );
    }


    try {

      // Parse Clean JSON
      const parsed =
        JSON.parse(
          jsonMatch[0]
        );


      return parsed;

    } catch (error) {

      throw new Error(
        "Invalid AI response format"
      );
    }
  };