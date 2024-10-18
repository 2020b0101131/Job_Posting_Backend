const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Assuming userModel is in the models folder

const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header is present and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extract the token from the header

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID (from the token payload) and attach to the request object
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        // If no token is provided
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
