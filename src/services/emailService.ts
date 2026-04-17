import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendBookingConfirmation = async (to: string, name: string, date: string, time: string) => {
  if (!process.env.SMTP_USER) {
    console.log(`[Mock Email] Booking confirmed for ${name} on ${date} at ${time}`);
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Clinic" <no-reply@clinic.com>',
    to,
    subject: 'Appointment Confirmation',
    text: `Dear ${name},\n\nYour appointment has been confirmed for ${date} at ${time}.\n\nThank you,\nThe Clinic Team`,
    html: `<p>Dear ${name},</p><p>Your appointment has been <strong>confirmed</strong> for ${date} at ${time}.</p><p>Thank you,<br/>The Clinic Team</p>`
  };

  await transporter.sendMail(mailOptions);
};
