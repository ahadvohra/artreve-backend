const express = require('express');
const router = express.Router();
const ContactSubmission = require('../models/ContactSubmission');
const { sendNotificationEmail } = require('../utils/mailer');

router.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const submission = await ContactSubmission.create({ firstName, lastName, email, message });
    await sendNotificationEmail('New contact form submission', submission);

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;