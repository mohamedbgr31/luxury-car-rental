const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/luxurycar';

// Define Schemas as they are in server.js
const requestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    car: { type: String, required: true },
    // carId might be missing in schema but present in data
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    rentalType: { type: String, required: true },
    totalPrice: { type: String, required: true },
    message: String,
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    urgent: {
        type: Boolean,
        default: false
    }
});

const Request = mongoose.model('Request', requestSchema);
const Car = require('./models/Car');

async function runDebug() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const period = 'all';
        const now = new Date();
        let startDate = new Date(0);

        console.log('Running Aggregation...');
        const topCars = await Request.aggregate([
            {
                $match: {
                    status: { $regex: /^accepted$/i },
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: "$carId",
                    name: { $first: "$car" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        console.log('Top Cars:', topCars);

        console.log('Fetching Fleet...');
        const allCars = await Car.find();
        console.log('Fleet count:', allCars.length);

        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('DEBUG ERROR:', error);
        process.exit(1);
    }
}

runDebug();
