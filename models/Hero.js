import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Luxury Car Rental',
  },
  subtitle: {
    type: String,
    default: 'Experience the thrill of driving premium vehicles',
  },
  carCard: {
    title: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    specs: [{
      type: String,
    }],
  },
}, {
  timestamps: true,
  collection: 'heros'
});

const Hero = mongoose.models.Hero || mongoose.model('Hero', heroSchema);

export default Hero;