const Job = require('../models/jobModel');

// Create a new job posting
const createJob = async (req, res) => {
    const { title, description, experienceLevel, candidates, endDate } = req.body;

    try {
        const job = await Job.create({
            companyId: req.user._id, // Get company ID from authenticated user
            title,
            description,
            experienceLevel,
            candidates,
            endDate,
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all job postings for a specific company
const getCompanyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ companyId: req.user._id });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add a candidate to a job posting
const addCandidate = async (req, res) => {
    const { email } = req.body;
    const jobId = req.params.id;

    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.candidates.push({ email });
        await job.save();
        res.status(200).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createJob, getCompanyJobs, addCandidate };
