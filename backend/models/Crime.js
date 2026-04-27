/**
 * models/Crime.js — Mongoose schema (expanded)
 * 10 cities · 10 crime types · area-level tracking · multi-year
 */
const mongoose = require('mongoose');

const crimeSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        enum: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
            'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'],
    },
    area: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Theft', 'Assault', 'Robbery', 'Murder', 'Fraud',
            'Kidnapping', 'Vandalism', 'Cybercrime', 'Drug Trafficking', 'Arson'],
    },
    date: { type: Date, required: true },
});

module.exports = mongoose.model('Crime', crimeSchema);
