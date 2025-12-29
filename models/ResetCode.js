import mongoose from 'mongoose';

const ResetCodeSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // 10 min expiry
});

export default mongoose.models?.ResetCode || mongoose.model('ResetCode', ResetCodeSchema); 