import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header';
import {
  saveRegisteredAccount,
  saveUserProfile,
  isValidSignIn,
  setUserLoggedIn,
} from '../data/appStorage';

export default function LoginRegister() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'register' | 'signin'>('register');

  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasCapital = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength || !hasCapital || !hasNumber || !hasSymbol) {
      return 'Password must be at least 8 characters with 1 capital letter, 1 number, and 1 symbol.';
    }
    return '';
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = {
      fullName: fullName ? '' : 'This field is required.',
      email: registerEmail ? (validateEmail(registerEmail) ? '' : 'Please enter a valid email.') : 'This field is required.',
      password: registerPassword ? validatePassword(registerPassword) : 'This field is required.',
    };

    setRegisterErrors(errors);

    if (!errors.fullName && !errors.email && !errors.password) {
      saveRegisteredAccount({
        fullName,
        email: registerEmail,
        password: registerPassword,
      });

      saveUserProfile({
        fullName,
        email: registerEmail,
      });

      setUserLoggedIn();
      navigate('/create-profile');
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isValidSignIn(signInEmail, signInPassword)) {
      setSignInError('');
      setUserLoggedIn();
      navigate('/search');
    } else {
      setSignInError('Email or password are not correct.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton onBackClick={() => navigate('/')} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'register'
                    ? 'text-cyan-500 border-b-2 border-cyan-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'signin'
                    ? 'text-cyan-500 border-b-2 border-cyan-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
            </div>

            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="p-6 md:p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                      placeholder="Enter your full name"
                    />
                    {registerErrors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{registerErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                      placeholder="Enter your email"
                    />
                    {registerErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {registerErrors.password && (
                      <p className="text-red-500 text-sm mt-1">{registerErrors.password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="p-6 md:p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showSignInPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {signInError && <p className="text-red-500 text-sm">{signInError}</p>}

                  <button
                    type="submit"
                    className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}