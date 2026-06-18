import axios from "axios";

export const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
    const response =
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "InternPath",
            email:
              process.env.BREVO_FROM,
          },
          to: [
            {
              email: to,
            },
          ],
          subject,
          htmlContent: html,
        },
        {
          headers: {
            accept:
              "application/json",
            "api-key":
              process.env.BREVO_API_KEY,
            "content-type":
              "application/json",
          },
          timeout: 30000,
        }
      );

    console.log(
      "Email sent:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Brevo API Error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};