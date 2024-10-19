const express = require('express');
const { sendJobEmails } = require('../controllers/emailController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:id/sendEmails', protect, sendJobEmails); 

module.exports = router;
