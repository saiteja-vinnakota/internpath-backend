import { z }
from "zod";

// UPDATE PROFILE SCHEMA
export const updateProfileSchema =
  z.object({

    body: z.object({

      // COMMON
      name:
        z.string()

          .min(
            3,
            "Name must be at least 3 characters"
          )

          .max(
            50,
            "Name cannot exceed 50 characters"
          )

          .optional(),

      bio:
        z.string()

          .max(
            500,
            "Bio cannot exceed 500 characters"
          )

          .optional(),

      location:
        z.string()

          .max(
            100,
            "Location too long"
          )

          .optional(),

      linkedin:
        z.string()

          .url(
            "Invalid LinkedIn URL"
          )

          .optional()

          .or(
            z.literal("")
          ),

      profilePicture:
        z.string()

          .optional(),

      // STUDENT
      skills:
        z.array(
          z.string()
        )

          .optional(),

      careerInterests:
        z.array(
          z.string()
        )

          .optional(),

      achievements:
        z.array(
          z.string()
        )

          .optional(),

      college:
        z.string()

          .max(
            100,
            "College name too long"
          )

          .optional(),

      github:
        z.string()

          .url(
            "Invalid GitHub URL"
          )

          .optional()

          .or(
            z.literal("")
          ),

      // RECRUITER
      company:
        z.string()

          .max(
            120,
            "Company name too long"
          )

          .optional(),

      designation:
        z.string()

          .max(
            120,
            "Designation too long"
          )

          .optional(),

      companyWebsite:
        z.string()

          .url(
            "Invalid company website URL"
          )

          .optional()

          .or(
            z.literal("")
          ),
    })
  });
