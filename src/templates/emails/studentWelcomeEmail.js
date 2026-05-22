const studentWelcomeEmail =
  (name) => {

    return `

      <div style="
        font-family: Arial, sans-serif;
        padding: 20px;
        line-height: 1.6;
      ">

        <h2 style="color: #2563eb;">
          Welcome to InternPath 
        </h2>

        <p>
          Hello ${name},
        </p>

        <p>
          Thank you for joining InternPath.
        </p>

        <p>
          Your student account is now ready.
        </p>

        <h3>
          What you can do now:
        </h3>

        <ul>
          <li>
            Upload your resume
          </li>

          <li>
            Get AI-powered job matching
          </li>

          <li>
            Apply for internships
          </li>

          <li>
            Track application status
          </li>

          <li>
            Receive realtime notifications
          </li>
        </ul>

        <p>
          Start building your career journey today.
        </p>

        <br />

        <p>
          Best Wishes,
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
  studentWelcomeEmail;