import mongoose from 'mongoose';

const doctorProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  license_number: { type: String, required: true, trim: true },
  qualification: { type: String, required: true },
  experience_years: { type: Number, required: true },
  consultation_fee: { type: Number, required: true },
  bio: String,
  is_verified: { type: Boolean, default: false },
  is_available: { type: Boolean, default: true },
  rating: { type: Number, default: 5.0 },
  total_consultations: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// enforce unique constraints at the schema level
// enforce one doctor profile per user and unique license numbers
// allow a user to create multiple doctor profiles if needed; only license numbers must be unique
// previously this enforced one profile per user which prevented adding multiple doctors
// allow multiple profiles per user; only license numbers must be unique
doctorProfileSchema.index({ license_number: 1 }, { unique: true });

// normalize license numbers to avoid case/whitespace duplicates
doctorProfileSchema.pre('save', function (next) {
  if (this.license_number && typeof this.license_number === 'string') {
    this.license_number = this.license_number.trim().toUpperCase();
  }
  next();
});

export default mongoose.model('DoctorProfile', doctorProfileSchema);
