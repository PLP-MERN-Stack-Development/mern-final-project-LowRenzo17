import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: { type: String, required: true },
  medications: [{ name: String, dosage: String, frequency: String }],
  instructions: String,
  file_url: String,
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model('Prescription', prescriptionSchema);
