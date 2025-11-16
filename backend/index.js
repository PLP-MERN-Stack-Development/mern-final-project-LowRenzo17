import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Validate critical environment variables early to avoid confusing runtime errors
if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment. Please set it in your .env file');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in environment. Please set JWT_SECRET in your .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
