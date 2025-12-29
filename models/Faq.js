import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
  },
  answer: {
    type: String,
    required: [true, "Answer is required"],
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  collection: 'faqs'
});

// Update the updatedAt timestamp before saving
faqSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Faq || mongoose.model('Faq', faqSchema); 