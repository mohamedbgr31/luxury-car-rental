import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
    default: '/img/default-car.jpg',
  },
  galleryImages: {
    type: [String],
    default: [],
  },
  galleryVideos: {
    type: [String],
    default: [],
  },
  logo: {
    type: String,
    default: '/img/default-logo.png',
  },
  categories: {
    supercar: { type: Boolean, default: false },
    luxury: { type: Boolean, default: false },
    sports: { type: Boolean, default: false },
    convertible: { type: Boolean, default: false },
  },
  specs: {
    type: [{
      icon: String,
      label: String,
    }],
    default: [],
  },
  transmission: {
    type: String,
    default: '',
  },
  topSpeed: {
    type: String,
    default: '',
  },
  seats: {
    type: String,
    default: '',
  },
  drive: {
    type: String, // e.g., "AWD", "RWD", "FWD"
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  pricing: {
    daily: { type: String, default: '0' },
    weekly: { type: String, default: '0' },
    monthly: { type: String, default: '0' },
  },
  features: {
    type: [String],
    default: [],
  },
  rentalRequirements: {
    type: [String],
    default: [],
  },
  faqs: {
    type: [{
      question: String,
      answer: String,
    }],
    default: [],
  },
  mileage: {
    limit: { type: String, default: '0' },
    additionalCharge: { type: String, default: '0' },
  },
  state: {
    type: String,
    enum: ['Available', 'Not-Available'],
    default: 'Available',
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Hybrid', 'Diesel', 'Electric'],
    default: 'Petrol',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
  unavailableDates: {
    type: [
      {
        from: { type: String },
        to: { type: String }
      }
    ],
    default: [],
  },
}, { 
  timestamps: true,
  collection: 'cars'
});

export default mongoose.models.Car || mongoose.model('Car', carSchema);