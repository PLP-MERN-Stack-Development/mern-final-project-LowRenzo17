import { useState, useEffect } from 'react';
import { Users, UserCheck, Calendar, CheckCircle, XCircle, Award } from 'lucide-react';
import { api } from '../../lib/api';

interface DoctorVerification {
  id: string;
  user_id: string;
  specialization: string;
  license_number: string;
  qualification: string;
  experience_years: number;
  is_verified: boolean;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface Stats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  pendingVerifications: number;
  totalAppointments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    pendingVerifications: 0,
    totalAppointments: 0,
  });
  const [pendingDoctors, setPendingDoctors] = useState<DoctorVerification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
  const [doctors, appointments] = await Promise.all([api.doctors.list(), api.appointments.list()]);

      // users count: derive from backend users endpoint if you have one. For now, count doctors/patients from doctor list and appointments length
      const totalAppointments = (appointments || []).length;
      const pending = (doctors || []).filter((d: any) => d.is_verified === false).length;

      setStats((s) => ({
        ...s,
        totalAppointments,
        pendingVerifications: pending,
        totalDoctors: (doctors || []).length,
      }));

      setPendingDoctors((doctors || []).filter((d: any) => !d.is_verified));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDoctor = async (doctorId: string, approve: boolean) => {
    try {
  const res = await api.doctors.verify(doctorId, approve);
  if ((res as any).error) throw new Error((res as any).error);
  loadDashboardData();
    } catch (error) {
      console.error('Error verifying doctor:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-1">Monitor platform activity and manage users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Users</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Doctors</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalDoctors}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Patients</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pendingVerifications}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Appointments</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pending Doctor Verifications</h3>
        </div>
        <div className="p-6">
          {pendingDoctors.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No pending verifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Dr. {doctor.profiles.full_name}</h4>
                      <p className="text-sm text-gray-600">{doctor.profiles.email}</p>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Specialization:</span>
                          <p className="text-gray-900">{doctor.specialization}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Qualification:</span>
                          <p className="text-gray-900">{doctor.qualification}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">License Number:</span>
                          <p className="text-gray-900">{doctor.license_number}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Experience:</span>
                          <p className="text-gray-900">{doctor.experience_years} years</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleVerifyDoctor(doctor.id, true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyDoctor(doctor.id, false)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
