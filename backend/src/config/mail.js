import nodemailer from 'nodemailer';

let transporter = null;

export const getMailTransporter = async () => {
  if (transporter) return transporter;

  const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_SERVICE } = process.env;

  // Use only EMAIL_USER and EMAIL_PASSWORD
  if (EMAIL_USER && EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE || 'gmail',
      auth: {
        user: EMAIL_USER.trim(),
        pass: EMAIL_PASSWORD.trim()
      }
    });

    console.log(`[Mail Service] Initialized SMTP transporter for: ${EMAIL_USER.trim()} using service: ${EMAIL_SERVICE || 'gmail'}`);
  } else {
    // In development without email credentials configured, log email preview to console
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n================== [LOCAL EMAIL PREVIEW] ==================');
        console.log(`From: ${mailOptions.from}`);
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Body:\n${mailOptions.text || mailOptions.html}`);
        console.log('===========================================================\n');
        return { messageId: 'dev-mock-id-' + Date.now() };
      }
    };
    console.log('[Mail Service] EMAIL_USER / EMAIL_PASSWORD not set. Using local console preview transport.');
  }

  return transporter;
};
