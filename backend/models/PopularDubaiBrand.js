const mongoose = require('mongoose');

const popularDubaiBrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true }
});

module.exports = mongoose.model('PopularDubaiBrand', popularDubaiBrandSchema); 