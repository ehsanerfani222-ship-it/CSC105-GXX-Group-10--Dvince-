import { useNavigate, useLocation } from 'react-router';
import logoImage from "../../assets/2de6da872438abe52acf9274adc00f171585b638.png";

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Header({ showBackButton, onBackClick }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <header className="bg-white shadow-sm px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center min-w-0">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <button onClick={() => navigate(isLoggedIn ? '/search' : '/')}>
          <img
            src={logoImage}
            alt="Dvince Logo"
            className="h-10 md:h-12 lg:h-14 hover:opacity-80 transition-opacity"
          />
        </button>
      </div>

      {isLoggedIn && (
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => navigate('/search')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              location.pathname.startsWith('/search') || location.pathname.startsWith('/user/')
                ? 'bg-cyan-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => navigate('/chat')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              location.pathname.startsWith('/chat')
                ? 'bg-cyan-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => navigate('/profile')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              location.pathname.startsWith('/profile') || location.pathname.startsWith('/my-skills')
                ? 'bg-cyan-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Profile
          </button>
        </div>
      )}
    </header>
  );
}