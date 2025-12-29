const mongoose = require('mongoose');
const Car = require('./backend/models/Car');
require('dotenv').config({ path: './backend/.env' }); // Adjust path if needed

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/luxurycar';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const cars = await Car.find();
        console.log('Found cars:', JSON.stringify(cars, null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
