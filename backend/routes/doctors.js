import express from 'express';
import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const doctors = await DoctorProfile.find({ is_verified: true })
      .populate('user_id', 'full_name email phone avatar_url');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doctor = await DoctorProfile.findById(req.params.id)
      .populate('user_id');
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    let { specialization, license_number, qualification, experience_years, consultation_fee, bio } = req.body;
    // normalize license number to match index normalization
    if (license_number && typeof license_number === 'string') {
      license_number = license_number.trim().toUpperCase();
    }
    // prevent duplicate license numbers
    const licenseTaken = await DoctorProfile.findOne({ license_number });
    if (licenseTaken) return res.status(400).json({ error: 'License number already in use' });

    const doctor = new DoctorProfile({
      user_id: req.userId,
      specialization,
      license_number,
      qualification,
      experience_years,
      consultation_fee,
      bio,
    });
    try {
      await doctor.save();
      res.status(201).json(doctor);
    } catch (saveErr) {
      // handle duplicate key errors (race conditions)
      if (saveErr && saveErr.code === 11000) {
        return res.status(400).json({ error: 'License number already in use' });
      }
      throw saveErr;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify or reject a doctor profile (admin only in real app)
router.patch('/:id/verify', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { approve } = req.body;

    const doctor = await DoctorProfile.findByIdAndUpdate(
      req.params.id,
      { is_verified: !!approve, updated_at: Date.now() },
      { new: true }
    );

    if (!doctor) return res.status(404).json({ error: 'Doctor profile not found' });

    // notify the user that their profile was approved/rejected
    await Notification.create({
      user_id: doctor.user_id,
      title: approve ? 'Profile Verified' : 'Profile Rejected',
      message: approve
        ? 'Your doctor profile has been verified. You can now accept appointments.'
        : 'Your doctor profile verification was declined. Please contact support.',
      type: 'system',
      related_id: doctor._id,
    });

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
