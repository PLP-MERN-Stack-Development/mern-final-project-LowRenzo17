import { useState, useEffect } from 'react';
import { X, Search, Calendar, Clock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

interface Doctor {
  id: string;
  user_id: string;
  specialization: string;
  consultation_fee: number;
  experience_years: number;
  rating: number;
  profiles: {
    full_name: string;
  };
}

interface BookAppointmentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookAppointmentModal({ onClose, onSuccess }: BookAppointmentModalProps) {
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await api.doctors.list();
      // api returns doctor profiles with populated user_id
      setDoctors(res || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !profile) return;
    setApiError('');
    setLoading(true);
    try {
      const appointmentPayload = {
        doctor_id: (selectedDoctor as any)._id || (selectedDoctor as any).id || selectedDoctor.id,
        appointment_date: formData.date,
        appointment_time: formData.time,
        reason: formData.reason,
        notes: '',
      };

      const res: any = await api.appointments.create(appointmentPayload);
      if (res?.error) {
        setApiError(res.error);
        return;
      }

      // create notification via backend (backend already creates notification on POST /appointments, but keep this for parity if needed)
      try {
        await api.notifications.list(); // noop to ensure API is reachable
      } catch (e) {
        // ignore
      }

  onSuccess();
    } catch (err: any) {
      console.error('Error booking appointment:', err);
      setApiError(err?.message || String(err) || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by doctor name or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setStep(2);
                    }}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          Dr. {doctor.profiles.full_name}
                        </h3>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{doctor.experience_years} years exp.</span>
                          <span>⭐ {doctor.rating.toFixed(1)}</span>
                          <span className="font-medium text-teal-600">
                            ${doctor.consultation_fee}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && selectedDoctor && (
            <div className="space-y-6">
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Selected Doctor</p>
                <p className="font-semibold text-gray-900">
                  Dr. {selectedDoctor.profiles.full_name}
                </p>
                <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    min={minDate}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                  placeholder="Describe your symptoms or reason for consultation..."
                  required
                />
              </div>

              {apiError && (
                <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700">
                  {apiError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={loading || !formData.date || !formData.time || !formData.reason}
                  className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
