import nodemailer from "nodemailer";

// Mail Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

// Send Email Utility
export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"InternPath" <${process.env.BREVO_FROM}>`,  
    to,
    subject,
    html,
    text: html.replace(/<[^>]*>/g, '')  
  };

  await transporter.sendMail(mailOptions);
};