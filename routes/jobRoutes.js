const express = require('express');
const { createJob, getCompanyJobs, addCandidate } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware'); // Ensure correct path
const router = express.Router();

router.post('/', protect, createJob); // Protected route for creating jobs
router.get('/', protect, getCompanyJobs); // Protected route for fetching company jobs
router.put('/:id/candidates', protect, addCandidate); // Protected route for adding candidates

module.exports = router;
