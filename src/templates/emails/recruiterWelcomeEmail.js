const recruiterWelcomeEmail =
  (name) => {

    return `

      <div style="
        font-family: Arial, sans-serif;
        padding: 20px;
        line-height: 1.6;
      ">

        <h2 style="color: #16a34a;">
          Welcome Recruiter 
        </h2>

        <p>
          Hello ${name},
        </p>

        <p>
          Thank you for joining InternPath.
        </p>

        <p>
          Your recruiter account is now active.
        </p>

        <h3>
          You can now:
        </h3>

        <ul>
          <li>
            Post internship opportunities
          </li>

          <li>
            Manage job applications
          </li>

          <li>
            Review AI match scores
          </li>

          <li>
            Shortlist candidates
          </li>

          <li>
            Send application updates
          </li>
        </ul>

        <p>
          We are excited to help you connect with talented students.
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
  recruiterWelcomeEmail;