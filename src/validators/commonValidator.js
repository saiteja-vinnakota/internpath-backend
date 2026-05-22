import { z }
from "zod";

import mongoose
from "mongoose";




// MongoDB ObjectId Validator
export const objectIdSchema =
  z.string().refine(

    (id) =>
      mongoose.Types.ObjectId.isValid(id),

    {
      message:
        "Invalid MongoDB ObjectId"
    }
  );




// Generic ID Params Schema
export const idParamsSchema =
  z.object({

    params: z.object({

      id:
        objectIdSchema
    })
  });