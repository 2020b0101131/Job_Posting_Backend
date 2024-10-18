const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    experienceLevel: {
        type: String,
        required: true,
    },
    candidates: [{
        email: {
            type: String,
            required: true,
        },
    }],
    endDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
