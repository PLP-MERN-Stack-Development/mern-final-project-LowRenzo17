import { useState } from 'react';
import { Stethoscope, Award, BookOpen, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

interface DoctorProfileSetupProps {
  onComplete: () => void;
}

export default function DoctorProfileSetup({ onComplete }: DoctorProfileSetupProps) {
  // ensure auth context is mounted (we don't need profile directly here)
  useAuth();
  const [formData, setFormData] = useState({
    specialization: '',
    license_number: '',
    qualification: '',
    experience_years: '',
    consultation_fee: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        specialization: formData.specialization,
        license_number: formData.license_number,
        qualification: formData.qualification,
        experience_years: parseInt(formData.experience_years),
        consultation_fee: parseFloat(formData.consultation_fee),
        bio: formData.bio,
      };

      const res: any = await api.doctors.create(payload);

      if (res?.error) {
        // backend returned an error payload (or 401), show it
        setError(res.error || 'Failed to create profile');
        return;
      }

  // success - show verification pending UI
  setSubmitted(true);
  // call onComplete after short delay so caller can navigate if needed
  if (onComplete) setTimeout(() => onComplete(), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {submitted ? (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-lg p-8 bg-yellow-50 border border-yellow-200 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-yellow-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Pending</h3>
              <p className="text-gray-700">Your profile is under review by our admin team. You'll be notified once your account is verified and you can start accepting appointments.</p>
              <div className="mt-6">
                <button
                  onClick={() => onComplete && onComplete()}
                  className="mt-2 inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
                >
                  Go to dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Doctor Profile</h2>
          <p className="text-gray-600 mt-2">
            Provide your professional details to start accepting appointments
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Specialization
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder="e.g., Cardiologist, Dermatologist"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical License Number
            </label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder="Enter your license number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualification
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder="e.g., MBBS, MD, MS"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Fee (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.consultation_fee}
                  onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Bio
            </label>
            <textarea
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
              placeholder="Tell patients about your expertise and experience..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Profile...' : 'Complete Setup'}
          </button>

          <p className="text-sm text-gray-600 text-center">
            Your profile will be reviewed by our admin team before you can start accepting
            appointments
          </p>
        </form>
        </>
        )}
      </div>
    </div>
  );
}
