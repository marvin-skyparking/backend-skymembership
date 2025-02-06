import nodemailer, { TransportOptions } from 'nodemailer';
import EnvConfig from '../configs/env.config';

// Ensure the configuration matches the TransportOptions type
const transporter = nodemailer.createTransport({
  host: EnvConfig.SMTP_HOST,
  port: Number(EnvConfig.SMTP_PORT),
  secure: false, // Use STARTTLS (secure: false for port 587)
  auth: {
    user: EnvConfig.EMAIL_USER,
    pass: EnvConfig.EMAIL_PASS
  }
} as TransportOptions); // Explicitly type as TransportOptions

/**
 * Sends an email using Nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML format
 */
export async function sendMail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const mailOptions = {
    from: EnvConfig.EMAIL_USER,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email sending failed: ${error}`);
    throw new Error('Email sending failed');
  }
}
