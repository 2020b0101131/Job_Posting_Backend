const express = require('express');
const {
    registerUser,
    authUser,
    verifyEmail,
    // verifyMobile,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/verify-email', verifyEmail); 
// router.post('/verify-mobile', verifyMobile); // Route for verifying mobile

module.exports = router;
