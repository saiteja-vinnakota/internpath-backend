import { z }
from "zod";




// Update Profile Schema
export const updateProfileSchema =
  z.object({

    body: z.object({

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




      skills:
        z.array(
          z.string()
        )

          .optional(),




      bio:
        z.string()

          .max(
            300,
            "Bio cannot exceed 300 characters"
          )

          .optional(),




      college:
        z.string()

          .max(
            100,
            "College name too long"
          )

          .optional(),




      location:
        z.string()

          .max(
            100,
            "Location too long"
          )

          .optional(),




      github:
        z.string()

          .url(
            "Invalid GitHub URL"
          )

          .optional(),




      linkedin:
        z.string()

          .url(
            "Invalid LinkedIn URL"
          )

          .optional(),




      profilePicture:
        z.string()

          .optional()
    })
  });