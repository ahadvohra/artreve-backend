const express = require('express');
const multer = require('multer');
const router = express.Router();
const ProjectRequest = require('../models/ProjectRequest');
const { uploadToCloudStorage } = require('../utils/upload');
const { sendNotificationEmail } = require('../utils/mailer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB cap
});

// upload.any() accepts a file under ANY field name, not just a specific one
router.post('/start-a-project', upload.any(), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      businessName,
      helpDescription,
      budget,
      source,
      additionalInfo,
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // req.files is an array (since upload.any() doesn't assume a field name) —
    // just take the first uploaded file, whatever it was named on the frontend
    const uploadedFile = req.files && req.files.length > 0 ? req.files[0] : null;

    let briefFileUrl;
    if (uploadedFile) {
      briefFileUrl = await uploadToCloudStorage(uploadedFile);
    }

    const submission = await ProjectRequest.create({
      firstName,
      lastName,
      email,
      businessName,
      helpDescription,
      budget,
      source,
      additionalInfo,
      briefFileUrl,
    });

    await sendNotificationEmail('New project request', submission);

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;