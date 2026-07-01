import rateLimit
from "express-rate-limit";




// Global API Limiter
export const apiLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 1000,

    message: {

      success: false,

      message:
        "Too many requests, please try again later."
    },

    standardHeaders: true,

    legacyHeaders: false
  });




// Auth Route Limiter
export const authLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 10,

    message: {

      success: false,

      message:
        "Too many login attempts, please try again later."
    },

    standardHeaders: true,

    legacyHeaders: false
  });




export default apiLimiter;