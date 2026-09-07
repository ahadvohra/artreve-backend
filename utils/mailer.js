const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendNotificationEmail(subject, data) {
  const bodyLines = Object.entries(data.toObject ? data.toObject() : data)
    .filter(([key]) => !['_id', '__v', 'createdAt'].includes(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFY_EMAIL,
    subject,
    text: bodyLines,
  });
}

module.exports = { sendNotificationEmail };