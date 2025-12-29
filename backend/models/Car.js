const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  title: { type: String }, // Card name/title
  image: { type: String }, // URL or base64
  pricing: {
    daily: { type: Number },
    weekly: { type: Number },
    monthly: { type: Number },
  },
  state: {
    type: String,
    enum: ['Available', 'Booked', 'In Service'],
    default: 'Available'
  },
  // Add other fields as needed
});

module.exports = mongoose.model('Car', CarSchema);