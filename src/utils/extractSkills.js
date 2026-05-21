import {
  KNOWN_SKILLS
} from "../constants/skills.js";




// Extract Skills From Resume Text
const extractSkills =
  (resumeText) => {

    const foundSkills = [];


    // Lowercase Resume
    const lowerResume =
      resumeText.toLowerCase();


    // Find Matching Skills
    for (
      const skill
      of KNOWN_SKILLS
    ) {

      if (
        lowerResume.includes(
          skill.toLowerCase()
        )
      ) {

        foundSkills.push(skill);
      }
    }


    return foundSkills;
  };


export default extractSkills;