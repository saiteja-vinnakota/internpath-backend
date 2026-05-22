import mongoose
from "mongoose";




const errorMiddleware =
  (
    err,
    req,
    res,
    next
  ) => {

    console.error(err);




    // Default Error
    let statusCode =
      err.statusCode || 500;

    let message =
      err.message ||
      "Internal Server Error";




    // MongoDB Cast Error
    if (
      err instanceof
      mongoose.Error.CastError
    ) {

      statusCode = 400;

      message =
        "Invalid MongoDB ObjectId";
    }




    // Mongo Duplicate Key Error
    if (
      err.code === 11000
    ) {

      statusCode = 400;

      const field =
        Object.keys(
          err.keyValue
        )[0];

      message =
        `${field} already exists`;
    }




    // Mongo Validation Error
    if (
      err instanceof
      mongoose.Error.ValidationError
    ) {

      statusCode = 400;

      message =
        Object.values(
          err.errors
        )
          .map(
            (val) =>
              val.message
          )
          .join(", ");
    }




    // JWT Invalid
    if (
      err.name ===
      "JsonWebTokenError"
    ) {

      statusCode = 401;

      message =
        "Invalid token";
    }




    // JWT Expired
    if (
      err.name ===
      "TokenExpiredError"
    ) {

      statusCode = 401;

      message =
        "Token expired";
    }




    return res.status(
      statusCode
    ).json({

      success: false,

      message
    });
  };




export default errorMiddleware;