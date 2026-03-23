import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Mail, MapPin, Phone, Edit, LogOut } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { getCurrentUserProfile, logoutUser } from '../data/appStorage';

export default function ViewOwnProfile() {
  const navigate = useNavigate();
  const user = getCurrentUserProfile();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <Header />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-cyan-100 flex items-center justify-center mb-4 overflow-hidden">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-16 h-16 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{user.fullName}</h2>
              <p className="text-cyan-500">{user.username}</p>
            </div>

            <div className="space-y-4">
              <InfoRow icon={<Mail size={20} className="text-gray-600" />} label="Email" value={user.email ?? ''} />
              <InfoRow icon={<Phone size={20} className="text-gray-600" />} label="Phone Number" value={user.phoneNumber ?? ''} />
              <InfoRow icon={<Calendar size={20} className="text-gray-600" />} label="Date of Birth" value={user.dateOfBirth} />
              <InfoRow icon={<MapPin size={20} className="text-gray-600" />} label="Location" value={[user.city, user.country].filter(Boolean).join(', ')} />
            </div>

            <div className="mt-8 space-y-4">
              {/* Top row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/create-profile')}
                  className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Edit
                </button>

                <button
                  onClick={() => navigate('/my-skills')}
                  className="flex-1 bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
                >
                  View Skills
                </button>
              </div>

              {/* Logout full width */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 py-3 rounded-lg hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
    
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{value || '-'}</p>
      </div>
    </div>
  );
}