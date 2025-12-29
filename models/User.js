import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['client', 'admin', 'manager', 'agent'],
    default: 'client',
  },
  // Per-user list of favorite cars
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
}, { 
  timestamps: true,
  collection: 'users'
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 