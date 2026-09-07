const nodemailer = require('nodemailer');
const dns = require('dns');

let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  const { address } = await dns.promises.lookup('smtp.gmail.com', { family: 4 });

  transporter = nodemailer.createTransport({
    host: address,
    port: 587,
    secure: false,
    tls: {
      servername: 'smtp.gmail.com', // required when connecting via raw IP so the cert still validates
    },
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
}

async function sendNotificationEmail(subject, data) {
  const bodyLines = Object.entries(data.toObject ? data.toObject() : data)
    .filter(([key]) => !['_id', '__v', 'createdAt'].includes(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const t = await getTransporter();
  await t.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFY_EMAIL,
    subject,
    text: bodyLines,
  });
}

module.exports = { sendNotificationEmail };