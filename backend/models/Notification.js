import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['appointment', 'prescription', 'system', 'reminder'],
    required: true 
  },
  is_read: { type: Boolean, default: false },
  related_id: mongoose.Schema.Types.ObjectId,
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);
