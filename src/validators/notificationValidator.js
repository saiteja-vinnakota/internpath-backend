import { z }
from "zod";

import {
  objectIdSchema
} from "./commonValidator.js";




// Notification Params Schema
export const notificationIdSchema =
  z.object({

    params: z.object({

      id:
        objectIdSchema
    })
  });