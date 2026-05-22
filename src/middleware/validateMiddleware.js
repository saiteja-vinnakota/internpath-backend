const validate =
  (schema) =>
    async (
      req,
      res,
      next
    ) => {

      try {

        req.validatedData =
          await schema.parseAsync({

            body: req.body,

            params: req.params,

            query: req.query
          });

        next();

      } catch (error) {

        return res.status(400).json({

          success: false,

          message: "Validation failed",

          errors:
            error.errors?.map(
              (err) => ({

                field:
                  err.path.join("."),

                message:
                  err.message
              })
            )
        });
      }
    };

export default validate;