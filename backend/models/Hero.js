const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  backgroundImage: { type: String, required: true },
  carCard: {
    title: { type: String, required: true },
    logo: { type: String, required: true },
    image: { type: String, required: true },
    specs: [{ type: String, required: true }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hero', heroSchema); 