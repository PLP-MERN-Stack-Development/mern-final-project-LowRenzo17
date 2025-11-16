import { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import DoctorProfileSetup from './DoctorProfileSetup';

interface DoctorProfile {
  id?: string;
  _id?: string;
  specialization: string;
  is_verified: boolean;
  is_available: boolean;
  total_consultations: number;
  rating: number;
}

interface Appointment {
  _id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  notes: string | null;
  patient_id?: { _id: string; full_name: string; phone?: string } | string;
  profiles?: { full_name: string; phone?: string };
}

export default function DoctorDashboard() {
  const { profile } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'confirmed' | 'completed'>('pending');

  useEffect(() => {
    if (profile) {
  loadDoctorProfile();
    }
  }, [profile]);

  useEffect(() => {
    if (doctorProfile) {
      loadAppointments();
    }
  }, [doctorProfile, selectedTab]);

  const loadDoctorProfile = async () => {
    try {
  const res = await api.doctors.list();
  // find doctor profile for current user
  const found = (res || []).find((d: any) => d.user_id === profile?.id || d.user_id?._id === profile?.id);
  setDoctorProfile(found || null);
    } catch (error) {
      console.error('Error loading doctor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    if (!doctorProfile) return;

    try {
      const res: any = await api.appointments.list();
      const list = (res || []).filter((a: any) => {
        const did = typeof a.doctor_id === 'string' ? a.doctor_id : a.doctor_id?._id || a.doctor_id?.id;
        return did === doctorProfile._id || did === (doctorProfile as any).id;
      }).filter((a: any) => a.status === selectedTab);
      setAppointments(list || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const handleAppointmentAction = async (appointmentId: string, newStatus: string) => {
    try {
  await api.appointments.update(appointmentId, { status: newStatus });
  loadAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!doctorProfile) {
    return <DoctorProfileSetup onComplete={loadDoctorProfile} />;
  }

  if (!doctorProfile.is_verified) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h2>
          <p className="text-gray-600">
            Your profile is under review by our admin team. You'll be notified once your account is
            verified and you can start accepting appointments.
          </p>
        </div>
      </div>
    );
  }

  const pendingCount = appointments.filter((apt) => apt.status === 'pending').length;
  const todayAppointments = appointments.filter(
    (apt) => apt.appointment_date === new Date().toISOString().split('T')[0]
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome, Dr. {profile?.full_name}</h2>
        <p className="text-gray-600 mt-1">Manage your appointments and patient consultations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting confirmation</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Today</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{todayAppointments}</p>
          <p className="text-sm text-gray-600 mt-1">Scheduled today</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{doctorProfile.total_consultations}</p>
          <p className="text-sm text-gray-600 mt-1">Consultations</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">⭐</span>
            </div>
            <h3 className="font-semibold text-gray-900">Rating</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{doctorProfile.rating.toFixed(1)}</p>
          <p className="text-sm text-gray-600 mt-1">Average rating</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTab('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedTab === 'pending'
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedTab('confirmed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedTab === 'confirmed'
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setSelectedTab('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedTab === 'completed'
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No {selectedTab} appointments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={(appointment as any)._id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{appointment.profiles?.full_name || 'Patient'}</h4>
                    {appointment.profiles?.phone && (
                      <p className="text-sm text-gray-600">{appointment.profiles.phone}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
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
                  {selectedTab === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAppointmentAction((appointment as any)._id, 'confirmed')}
                        className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition"
                        title="Accept"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAppointmentAction((appointment as any)._id, 'cancelled')}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                        title="Decline"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  {selectedTab === 'confirmed' && (
                    <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition text-sm font-medium">
                      Start Call
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
