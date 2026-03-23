import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { MapPin } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { filterProfiles } from '../data/mockData';

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get('query') ?? '';
  const category = searchParams.get('category') ?? '';
  const subCategory = searchParams.get('subCategory') ?? '';
  const experienceLevel = searchParams.get('experienceLevel') ?? '';

  const results = useMemo(
    () =>
      filterProfiles({
        query,
        category,
        subCategory,
        experienceLevel,
      }),
    [query, category, subCategory, experienceLevel],
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-blue-100 text-blue-700';
      case 'Advanced':
        return 'bg-purple-100 text-purple-700';
      case 'Master':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <Header showBackButton onBackClick={() => navigate('/search')} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h2>
          <p className="text-gray-600 mb-6">{results.length} profiles found</p>

          {results.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
              No profiles match your search.
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {results.map((user) => {
                const visibleSkills = user.skills.map((skill) => skill.subCategory);
                const firstLevel = user.skills[0]?.experienceLevel ?? '';

                return (
                  <div
                    key={user.id}
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                          {user.fullName}
                        </h3>
                        <p className="text-cyan-500 text-sm md:text-base mb-2">
                          {user.username}
                        </p>

                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                          <MapPin size={16} />
                          <span>
                            {user.city}, {user.country}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {visibleSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}

                          {firstLevel && (
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(firstLevel)}`}
                            >
                              {firstLevel}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-400"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}