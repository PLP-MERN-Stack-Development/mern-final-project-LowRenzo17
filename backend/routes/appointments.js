import express from 'express';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ patient_id: req.userId }, { doctor_id: req.userId }]
    })
      .populate('patient_id', 'full_name email')
      // populate doctor profile and the doctor's user info (full_name, avatar_url)
      .populate({ path: 'doctor_id', populate: { path: 'user_id', select: 'full_name avatar_url' } })
      .sort({ appointment_date: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_time, reason, notes } = req.body;
    // prevent duplicate appointment for same patient/doctor/date/time
    const duplicate = await Appointment.findOne({
      patient_id: req.userId,
      doctor_id,
      appointment_date: new Date(appointment_date),
      appointment_time,
    });

    if (duplicate) return res.status(400).json({ error: 'You already have an appointment at this time with this doctor' });

    const appointment = new Appointment({
      patient_id: req.userId,
      doctor_id,
      appointment_date,
      appointment_time,
      reason,
      notes,
    });

    await appointment.save();

    await Notification.create({
      user_id: doctor_id,
      title: 'New Appointment',
      message: `New appointment request received`,
      type: 'appointment',
      related_id: appointment._id,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: Date.now() },
      { new: true }
    );
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
