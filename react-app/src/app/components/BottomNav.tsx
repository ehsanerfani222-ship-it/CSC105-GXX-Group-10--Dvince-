import { useNavigate, useLocation } from 'react-router';
import { Search, MessageCircle, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadChatCount = 3;

  const isActive = (type: 'search' | 'chat' | 'profile') => {
    if (type === 'search') {
      return location.pathname.startsWith('/search') || location.pathname.startsWith('/user/');
    }
    if (type === 'chat') {
      return location.pathname.startsWith('/chat');
    }
    return location.pathname.startsWith('/profile') || location.pathname.startsWith('/my-skills');
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => navigate('/search')}
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('search') ? 'text-cyan-500' : 'text-gray-600'
          }`}
        >
          <Search size={22} />
          <span className="text-xs mt-1">Search</span>
        </button>

        <button
          onClick={() => navigate('/chat')}
          className={`flex flex-col items-center justify-center flex-1 h-full relative ${
            isActive('chat') ? 'text-cyan-500' : 'text-gray-600'
          }`}
        >
          <div className="relative">
            <MessageCircle size={22} />
            {unreadChatCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {unreadChatCount > 9 ? '9+' : unreadChatCount}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">Chats</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('profile') ? 'text-cyan-500' : 'text-gray-600'
          }`}
        >
          <User size={22} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
}