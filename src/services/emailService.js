import nodemailer from "nodemailer";

// CREATE TRANSPORTER
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

// VERIFY SMTP CONNECTION ON SERVER START
transporter.verify((error, success) => {
  if (error) {
    console.error(
      "❌ Brevo SMTP Connection Error:",
      error
    );
  } else {
    console.log(
      "✅ Brevo SMTP Ready"
    );
  }
});

// SEND EMAIL
export const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
    console.log(
      `📧 Sending email to ${to}`
    );

    const info =
      await transporter.sendMail({
        from: `"InternPath" <${process.env.BREVO_FROM}>`,
        to,
        subject,
        html,
        text: html.replace(
          /<[^>]*>/g,
          ""
        ),
      });

    console.log(
      "✅ Email Sent:",
      info.messageId
    );

    return info;
  } catch (error) {
    console.error(
      "❌ Email Send Error:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to send email"
    );
  }
};