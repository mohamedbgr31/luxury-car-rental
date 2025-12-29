const mongoose = require('mongoose');
const Car = require('./models/Car');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/luxurycar';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const cars = await Car.find();
        console.log('Found cars:', JSON.stringify(cars, null, 2));

        const Request = mongoose.model('Request', new mongoose.Schema({
            timestamp: Date,
            status: String,
            totalPrice: String,
            car: String
        }));
        const requests = await Request.find();
        console.log('Found requests:', JSON.stringify(requests, null, 2));

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
