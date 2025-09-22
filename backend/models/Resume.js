const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
    candidateName: String,
    consultantName: String,
    skills: [String],
    experience: Number,
    noticePeriod: String,
    location: String,
    priority: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", ResumeSchema);
