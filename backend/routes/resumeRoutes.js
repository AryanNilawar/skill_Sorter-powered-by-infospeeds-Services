const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer(); // multer memory storage

// Upload resume
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const { candidateName, consultantName, skills, experience, noticePeriod, location, priority } = req.body;

        // Upload PDF to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "raw", folder: "resumes" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        const resume = new Resume({
            candidateName,
            consultantName,
            skills: skills.split(",").map(s => s.trim()),
            experience,
            noticePeriod,
            location,
            priority,
            fileUrl: result.secure_url
        });

        await resume.save();
        res.json(resume);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Get all resumes
router.get("/", async (req, res) => {
    try {
        const resumes = await Resume.find().sort({ uploadedAt: -1 });
        res.json(resumes);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;
