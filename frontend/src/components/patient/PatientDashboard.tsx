import { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, Video, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import BookAppointmentModal from './BookAppointmentModal';

interface Appointment {
  _id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  patient_id: { _id: string; full_name: string } | string;
  doctor_id: {
    _id: string;
    specialization?: string;
    user_id?: { _id: string; full_name: string; avatar_url?: string };
  } | string;
}

export default function PatientDashboard() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);

  useEffect(() => {
    if (profile) loadAppointments();
  }, [profile]);

  const loadAppointments = async () => {
    try {
      const res = await api.appointments.list();
      // API returns array of appointments where doctor_id and patient_id are populated
      const data = Array.isArray(res) ? res : res;
      // filter to current patient
      const filtered = (data || []).filter((a: any) => {
        const pid = typeof a.patient_id === 'string' ? a.patient_id : a.patient_id?._id || a.patient_id?._id;
        return pid === profile?.id || (a.patient_id && a.patient_id._id === profile?.id);
      });
      setAppointments(filtered);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'confirmed' || apt.status === 'pending'
  );

  const pastAppointments = appointments.filter((apt) => apt.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.full_name}</h2>
          <p className="text-gray-600 mt-1">Manage your appointments and health records</p>
        </div>
        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Upcoming</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{upcomingAppointments.length}</p>
          <p className="text-sm text-gray-600 mt-1">Scheduled appointments</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pastAppointments.length}</p>
          <p className="text-sm text-gray-600 mt-1">Past consultations</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Active Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-600 mt-1">Live consultations</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading appointments...</div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No upcoming appointments</p>
              <button
                onClick={() => setShowBookModal(true)}
                className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
              >
                Book your first appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={(appointment as any)._id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Dr. {typeof appointment.doctor_id !== 'string' && appointment.doctor_id.user_id ? appointment.doctor_id.user_id.full_name : 'Unknown'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {typeof appointment.doctor_id !== 'string' ? appointment.doctor_id.specialization : ''}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(appointment.appointment_date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(appointment.appointment_time)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-medium">Reason:</span> {appointment.reason}
                    </p>
                  </div>
                    {appointment.status === 'confirmed' && (
                    <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition text-sm font-medium">
                      Join Call
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showBookModal && (
        <BookAppointmentModal
          onClose={() => setShowBookModal(false)}
          onSuccess={() => {
            setShowBookModal(false);
            loadAppointments();
          }}
        />
      )}
    </div>
  );
}
