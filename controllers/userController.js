const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer'); // Import Nodemailer for email
// const { sendVerificationSMS } = require('../utils/smsService'); // Import the SMS service (will be used later)

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Send Verification Email with OTP
const sendVerificationEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Change to your email service provider if needed
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: email,
            subject: 'Your OTP Code',
            html: `<p>Your OTP code is: <strong>${otp}</strong></p>
                   <p>Please use this code to verify your email address.</p>`,
        });

        console.log('OTP email sent to: ' + email);
    } catch (error) {
        console.error('Error sending OTP email:', error.message);
        throw new Error('Email sending failed');
    }
};

// Register new user
const registerUser = async (req, res) => {
    const { name, phoneNo, companyName, companyEmail, employeeSize } = req.body;

    try {
        const userExists = await User.findOne({ companyEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            phoneNo,
            companyName,
            companyEmail,
            employeeSize,
        });

        // Generate a 6-digit OTP code
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP code
        user.verificationCode = verificationCode; // Save the OTP code in the user object
        user.verificationTokenExpiry = Date.now() + 3600000; // 1 hour expiry for the OTP
        await user.save();

        // Send OTP via email
        await sendVerificationEmail(user.companyEmail, verificationCode);

        // Auto-login: Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.companyEmail,
            token: token, // Return the generated token
            message: 'OTP sent via email! Please verify to complete registration.',
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Login user
const authUser = async (req, res) => {
    const { email } = req.body; // Only email is needed

    try {
        const user = await User.findOne({ companyEmail: email }); // Search by companyEmail
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.companyEmail,
                token: generateToken(user._id), // Generate and return token
            });
        } else {
            res.status(401).json({ message: 'Invalid email' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};


// Verify email OTP
const verifyEmail = async (req, res) => {
    const { code, email } = req.body;

    try {
        const user = await User.findOne({ companyEmail: email });
        if (!user || user.verificationCode !== Number(code)) {
            return res.status(400).json({ message: 'Invalid OTP code' });
        }

        user.isVerified = true;
        user.verificationCode = undefined; // Clear OTP code
        user.verificationTokenExpiry = undefined; // Clear expiry time
        await user.save();

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// // Verify mobile OTP
// const verifyMobile = async (req, res) => {
//     const { code, phoneNo } = req.body;

//     try {
//         const user = await User.findOne({ phoneNo });
//         if (!user || user.verificationCode !== Number(code)) {
//             return res.status(400).json({ message: 'Invalid OTP code' });
//         }

//         user.isVerified = true;
//         user.verificationCode = undefined; // Clear OTP code
//         await user.save();

//         res.status(200).json({ message: 'Mobile verified successfully!' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error, please try again later.' });
//     }
// };

module.exports = {
    registerUser,
    authUser,
    verifyEmail,
    // verifyMobile,
};
