import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DoctorProfile', required: true },
  appointment_date: { type: Date, required: true },
  appointment_time: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  reason: { type: String, required: true },
  notes: String,
  video_room_id: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// compound unique index to prevent duplicate bookings
appointmentSchema.index({ patient_id: 1, doctor_id: 1, appointment_date: 1, appointment_time: 1 }, { unique: true });

export default mongoose.model('Appointment', appointmentSchema);
