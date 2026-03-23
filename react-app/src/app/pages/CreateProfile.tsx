import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import { getCurrentUserProfile, saveUserProfile } from '../data/appStorage';

export default function CreateProfile() {
  const navigate = useNavigate();
  const currentUser = getCurrentUserProfile();

  const isEditMode = useMemo(() => {
    return Boolean(
      currentUser.username && currentUser.username !== '@username'
    );
  }, [currentUser.username]);

  const [profilePicture, setProfilePicture] = useState<string>(currentUser.profilePicture || '');
  const [username, setUsername] = useState(
    currentUser.username && currentUser.username !== '@username'
      ? currentUser.username.replace(/^@/, '')
      : ''
  );
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
  const [dateOfBirth, setDateOfBirth] = useState(currentUser.dateOfBirth || '');
  const [country, setCountry] = useState(currentUser.country || '');
  const [city, setCity] = useState(currentUser.city || '');

  const [errors, setErrors] = useState({
    username: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: '',
    city: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const trimmedUsername = username.trim();
    const normalizedUsername = trimmedUsername
      ? trimmedUsername.startsWith('@')
        ? trimmedUsername
        : `@${trimmedUsername}`
      : '';

    const newErrors = {
      username: normalizedUsername ? '' : 'This field is required.',
      phoneNumber: phoneNumber.trim() ? '' : 'This field is required.',
      dateOfBirth: dateOfBirth ? '' : 'This field is required.',
      country: country.trim() ? '' : 'This field is required.',
      city: city.trim() ? '' : 'This field is required.',
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      saveUserProfile({
        fullName: currentUser.fullName,
        email: currentUser.email,
        username: normalizedUsername,
        phoneNumber: phoneNumber.trim(),
        dateOfBirth,
        country: country.trim(),
        city: city.trim(),
        profilePicture,
      });

      navigate(isEditMode ? '/profile' : '/add-skill');
    }
  };

  const handleBack = () => {
    navigate(isEditMode ? '/profile' : '/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton onBackClick={handleBack} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {profilePicture ? (
                      <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>

                  <label className="cursor-pointer bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  placeholder="Enter your country"
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleSubmit}
                className="bg-cyan-500 text-white p-4 rounded-full hover:bg-cyan-600 transition-colors shadow-lg"
                aria-label={isEditMode ? 'Save profile' : 'Next step'}
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}