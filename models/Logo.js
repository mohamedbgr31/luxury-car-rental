import mongoose from 'mongoose';

const logoSchema = new mongoose.Schema({
  navbarLogo: {
    type: String,
    required: true,
    default: '/img/noblelogo.png'
  },
  companyName: {
    type: String,
    required: true,
    default: 'Noble Car Rental'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'logos'
});

const Logo = mongoose.models.Logo || mongoose.model('Logo', logoSchema);

export default Logo;
