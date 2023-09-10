// models/Test.js
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    lang: {
        type: String,
        required: true,
    },
    completionTime: {
        type: Number, // Assuming completion time is in milliseconds
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    score: {
        type: Number,
        default: 0
    },
}, {
    collection: 'tests',
    timestamps: true
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
