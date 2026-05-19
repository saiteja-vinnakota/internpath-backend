import ErrorResponse from "../utils/errorResponse.js";

const authorizeRoles = (...roles) => {

  return (req, res, next) => {

    if (
      !roles.includes(req.user.role)
    ) {

      return next(
        new ErrorResponse(
          "Access denied",
          403
        )
      );
    }

    next();
  };
};

export default authorizeRoles;