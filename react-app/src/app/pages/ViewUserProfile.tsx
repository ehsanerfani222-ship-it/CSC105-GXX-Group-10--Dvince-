import { useNavigate, useParams } from 'react-router';
import { Calendar, MapPin, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { findProfile } from '../data/mockData';

export default function ViewUserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = findProfile(id);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <Header showBackButton onBackClick={() => navigate('/search')} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{user.fullName}</h2>
              <p className="text-cyan-500 mb-4">{user.username}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                <Calendar className="text-gray-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium text-gray-900">{user.dateOfBirth}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                <MapPin className="text-gray-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{user.city}, {user.country}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => navigate(`/user/${user.id}/skills`)}
                className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                View Skills
              </button>
              <button
                onClick={() => navigate(`/chat/${user.id}`, { state: { from: `/user/${user.id}` } })}
                className="flex-1 bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Message
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}