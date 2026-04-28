import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { doesAccountExist } from '../data/appStorage';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const accountExists = doesAccountExist(email);

      if (accountExists) {
        setIsSubmitted(true);
      } else {
        setError('No account found with this email address');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResend = () => {
    setIsSubmitted(false);
    setEmail('');
    setError('');
  };

  return (
    <PageLayout
      showBackButton
      onBackClick={() => navigate('/login')}
      mainClassName="container mx-auto px-4 md:px-6 lg:px-8 py-8"
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {!isSubmitted ? (
            <>
              {/* Reset Password Form */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={28} className="text-cyan-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-gray-600 mt-2 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition ${
                        error ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                      <AlertCircle size={14} />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-cyan-500 text-sm hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
                <p className="text-gray-600 mt-2 text-sm">
                  We've sent a password reset link to:
                </p>
                <p className="font-medium text-gray-900 mt-1">{email}</p>

                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <p className="text-sm text-gray-600">
                    Didn't receive the email? Check your spam folder or
                  </p>
                  <button
                    onClick={handleResend}
                    className="text-cyan-500 text-sm font-medium mt-1 hover:underline"
                  >
                    Click here to try again
                  </button>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="mt-6 w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
                >
                  Return to Login
                </button>
              </div>
            </>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Having trouble? Contact support@dvince.com
        </p>
      </div>
    </PageLayout>
  );
}