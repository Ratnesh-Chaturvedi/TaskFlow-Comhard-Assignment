import { getMailTransporter } from '../config/mail.js';

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  const transporter = await getMailTransporter();

  const senderEmail = process.env.EMAIL_USER?.trim() || 'no-reply@taskflow.local';
  const from = `"TaskFlow" <${senderEmail}>`;

  const mailOptions = {
    from,
    to,
    subject: 'TaskFlow - Password Reset Request',
    text: `You have requested to reset your password for TaskFlow.\n\nPlease click on the following link or paste it into your browser to complete the process within 15 minutes:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <h2 style="color: #6366f1; margin: 0;">TaskFlow</h2>
        </div>
        <h3 style="color: #1e293b; margin-top: 0;">Reset Your Password</h3>
        <p style="color: #64748b; line-height: 1.6;">We received a request to reset your password. Click the button below to choose a new password. This link is valid for 15 minutes.</p>
        <div style="margin: 28px 0;">
          <a href="${resetUrl}" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">If the button above doesn't work, copy and paste this URL into your browser:</p>
        <p style="color: #6366f1; font-size: 13px; word-break: break-all;">${resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">If you did not make this request, you can safely ignore this email.</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};
