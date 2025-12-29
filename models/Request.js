import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  name: String,
  contact: String,
  car: String,
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  dateFrom: String,
  dateTo: String,
  totalDays: Number,
  rentalType: String,
  totalPrice: String,
  message: String,
  status: { type: String, default: 'pending' },
  urgent: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userPhone: { type: String },
}, {
  collection: 'requests'
});

export default mongoose.models.Request || mongoose.model('Request', RequestSchema); 