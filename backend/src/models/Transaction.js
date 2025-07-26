import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payment_id: String,
  amount: Number,
  currency: String,
  method: String,
  status: String,
  description: String,
  created_at: Date,
  merchant_details: Object,
  category: String,
  location: Object,
  isRecurring: Boolean,
  anomaly: Boolean
});

export default mongoose.model('Transaction', transactionSchema);
