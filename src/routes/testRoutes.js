import express from "express";
import { sendEmail } from "../services/emailService.js";

const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "vinnakotasaiteja123@gmail.com",
      "Brevo Test - InternPath",
      "<h2>Brevo is working! 🎉</h2><p>Emails are set up correctly.</p>",
    );
    res.json({ success: true, message: "Email sent! Check your inbox." });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

export default router;
