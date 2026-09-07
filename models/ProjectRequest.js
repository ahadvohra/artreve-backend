const mongoose = require('mongoose');

const ProjectRequestSchema = new mongoose.Schema({
  firstName:       { type: String, required: true },
  lastName:        { type: String, required: true },
  email:           { type: String, required: true },
  businessName:    String,
  helpDescription: String,
  budget:          String,
  source:          String,
  additionalInfo:  String,
  briefFileUrl:    String,
  createdAt:       { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProjectRequest', ProjectRequestSchema);