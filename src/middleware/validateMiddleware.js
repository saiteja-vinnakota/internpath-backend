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

            query: req.query,
          });

        next();

      } catch (error) {

        const issues =
          error.issues || [];

        return res.status(400).json({

          success: false,

          message:
            issues[0]?.message ||
            "Validation failed",

          errors:
            issues.map(
              (issue) => ({

                field:
                  issue.path.join("."),

                message:
                  issue.message,
              })
            ),
        });
      }
    };

export default validate;