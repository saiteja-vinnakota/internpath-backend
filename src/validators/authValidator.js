import { z }
from "zod";

import {
  ROLES
} from "../constants/roles.js";




// Register Schema
export const registerSchema =
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
          ),




      email:
        z.string()

          .email(
            "Invalid email format"
          ),




      password:
        z.string()

          .min(
            6,
            "Password must be at least 6 characters"
          )

          .max(
            50,
            "Password too long"
          ),




      role:
        z.enum([

          ROLES.STUDENT,

          ROLES.RECRUITER
        ])
    })
  });




// Login Schema
export const loginSchema =
  z.object({

    body: z.object({

      email:
        z.string()

          .email(
            "Invalid email format"
          ),




      password:
        z.string()

          .min(
            6,
            "Password must be at least 6 characters"
          )
    })
  });