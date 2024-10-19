const nodemailer = require('nodemailer');
const Job = require('../models/jobModel');
const dotenv = require('dotenv');
dotenv.config();



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
     
    },
});


const sendJobEmails = async (req, res) => {
    const jobId = req.params.id;

    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const candidates = job.candidates.map(candidate => candidate.email);

     
        candidates.forEach((email) => {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `New Job Posting: ${job.title}`,
                text: `Hello, We have a new job opening for ${job.title}. Experience Level: ${job.experienceLevel===1?("Junior"):(job.experienceLevel===2?("Mid-Level"):("Senior"))}. Please visit our site for more information.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log(`Email sent to ${email}: ${info.response}`);
                }
            });
        });

        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { sendJobEmails };
