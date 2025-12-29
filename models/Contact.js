import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema({
  phone: {
    value: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    errorMessage: { type: String, default: "" },
    pattern: { type: String, default: "^\\+[0-9]{1,4}\\s[0-9\\s]{5,}$" },
    validationMessage: { type: String, default: "Please enter a valid phone number (e.g., +971 50 123 4567)" },
    lastUpdated: { type: Date, default: Date.now }
  },
  email: {
    value: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    errorMessage: { type: String, default: "" },
    pattern: { type: String, default: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" },
    validationMessage: { type: String, default: "Please enter a valid email address" },
    lastUpdated: { type: Date, default: Date.now }
  },
  hours: {
    value: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    errorMessage: { type: String, default: "" },
    pattern: { type: String, default: ".+" },
    validationMessage: { type: String, default: "Working hours cannot be empty" },
    lastUpdated: { type: Date, default: Date.now }
  },
  address: {
    value: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    errorMessage: { type: String, default: "" },
    pattern: { type: String, default: ".+" },
    validationMessage: { type: String, default: "Address cannot be empty" },
    lastUpdated: { type: Date, default: Date.now }
  }
});

const socialMediaSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  link: { type: String, required: true },
  active: { type: Boolean, default: true }
});

const contactSchema = new mongoose.Schema({
  contactInfo: { type: contactInfoSchema, required: true },
  socialMedia: [socialMediaSchema],
  lastUpdated: { type: Date, default: Date.now }
}, {
  collection: 'contacts'
});

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);
