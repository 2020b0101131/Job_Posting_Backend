const express = require('express');
const { createJob, getCompanyJobs, addCandidate } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware'); 
const router = express.Router();

router.post('/', protect, createJob); 
router.get('/', protect, getCompanyJobs); 
router.put('/:id/candidates', protect, addCandidate); 

module.exports = router;
