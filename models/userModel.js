const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNo: { 
        type: String,
        required: true,
    },
    companyName: { 
        type: String,
        required: true,
    },
    companyEmail: { 
        type: String,
        required: true,
        unique: true,
    },
    employeeSize: { 
        type: Number,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: { 
        type: String,
    },
    verificationTokenExpiry: { 
        type: Date,
    },
    verificationCode: { 
        type: Number,
    },
    // Uncomment if you are planning to handle user passwords
    // password: {
    //     type: String,
    //     required: true,
    // },
});

// Hash password before saving if you are managing passwords
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password for login (if password management is included)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
