import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const useApi = process.env.NODE_ENV === "production";

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: String(process.env.EMAIL_SECURE).toLowerCase() === "true",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});


export async function sendEmail({ to, subject, html, text }) {
  try {
    if (useApi) {
      // Send via Brevo API
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: process.env.EMAIL_FROM_NAME || "Your App", email: process.env.EMAIL_FROM },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          textContent: text || html.replace(/<[^>]+>/g, ""),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Brevo API Error: ${errText}`);
      }

      console.log(`✅ Email sent successfully via Brevo to ${to}`);
      return { success: true, message: "Email sent via Brevo API" };
    }

    // Send via SMTP
    const info = await transporter.sendMail({
      from: { name: process.env.EMAIL_FROM_NAME || "Your App", address: process.env.EMAIL_FROM },
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ""),
      envelope: { from: process.env.EMAIL_FROM, to },
    });

    console.log(`✅ Email sent successfully via SMTP to ${to}. MessageId: ${info.messageId}`);
    return { success: true, message: "Email sent via SMTP", data: info };
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
    return { success: false, message: err.message };
  }
}
