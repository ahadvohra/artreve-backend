const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendNotificationEmail(subject, data) {
  const bodyLines = Object.entries(data.toObject ? data.toObject() : data)
    .filter(([key]) => !['_id', '__v', 'createdAt'].includes(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  await resend.emails.send({
    from: 'onboarding@resend.dev', // works immediately without domain verification
    to: process.env.NOTIFY_EMAIL,
    subject,
    text: bodyLines,
  });
}

module.exports = { sendNotificationEmail };