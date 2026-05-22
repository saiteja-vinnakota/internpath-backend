const applicationStatusTemplate =
  (
    name,
    company,
    jobTitle,
    status
  ) => {

    return `

      <div style="
        font-family: Arial, sans-serif;
        padding: 20px;
        line-height: 1.6;
      ">

        <h2>
          Application Status Update
        </h2>

        <p>
          Hello ${name},
        </p>

        <p>
          Your application for
          <strong>${jobTitle}</strong>
          at
          <strong>${company}</strong>
          has been updated.
        </p>

        <h3>
          Current Status:
          ${status.toUpperCase()}
        </h3>

        <p>
          Please login to InternPath
          for more details.
        </p>

        <br />

        <p>
          Regards,
        </p>

        <p>
          <strong>
            Team InternPath
          </strong>
        </p>

      </div>
    `;
  };




export default
  applicationStatusTemplate;