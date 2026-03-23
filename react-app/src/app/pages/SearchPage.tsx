import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { categories, experienceLevels, filterProfiles } from '../data/mockData';

export default function SearchPage() {
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // draft values the user is editing
  const [draftSearchQuery, setDraftSearchQuery] = useState('');
  const [draftCategory, setDraftCategory] = useState('');
  const [draftSubCategory, setDraftSubCategory] = useState('');
  const [draftLevel, setDraftLevel] = useState('');

  // applied values used for actual results
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const results = useMemo(() => {
    if (!hasSearched) return [];

    return filterProfiles({
      query: searchQuery,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      experienceLevel: selectedLevel,
    });
  }, [hasSearched, searchQuery, selectedCategory, selectedSubCategory, selectedLevel]);

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

  const handleSearch = () => {
    setSearchQuery(draftSearchQuery);
    setSelectedCategory(draftCategory);
    setSelectedSubCategory(draftSubCategory);
    setSelectedLevel(draftLevel);
    setHasSearched(true);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setDraftCategory('');
    setDraftSubCategory('');
    setDraftLevel('');
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedLevel('');
    setHasSearched(false);
  };

  const handleClearAll = () => {
    setDraftSearchQuery('');
    setDraftCategory('');
    setDraftSubCategory('');
    setDraftLevel('');
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedLevel('');
    setHasSearched(false);
    setShowFilters(false);
  };

  const hasActiveAppliedFilters = Boolean(
    selectedCategory || selectedSubCategory || selectedLevel
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <Header />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Search
          </h2>
          <p className="text-gray-600 mb-6">
            Search for a profile name or filter by category, sub-category and experience level.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={draftSearchQuery}
                  onChange={(e) => setDraftSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  placeholder="Search by profile name..."
                />
              </div>

              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className={`p-3 rounded-lg transition-colors ${
                  showFilters ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Open filters"
              >
                <SlidersHorizontal size={24} />
              </button>

              <button
                onClick={handleSearch}
                className="bg-cyan-500 text-white px-5 py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
              >
                Search
              </button>
            </div>

            {(hasSearched || hasActiveAppliedFilters) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCategory && (
                  <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm">
                    {selectedCategory}
                  </span>
                )}
                {selectedSubCategory && (
                  <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm">
                    {selectedSubCategory}
                  </span>
                )}
                {selectedLevel && (
                  <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm">
                    {selectedLevel}
                  </span>
                )}

                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
                >
                  <X size={14} />
                  Clear search
                </button>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Reset
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={draftCategory}
                    onChange={(e) => {
                      setDraftCategory(e.target.value);
                      setDraftSubCategory('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  >
                    <option value="">All categories</option>
                    {Object.keys(categories).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-category
                  </label>
                  <select
                    value={draftSubCategory}
                    onChange={(e) => setDraftSubCategory(e.target.value)}
                    disabled={!draftCategory}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  >
                    <option value="">All sub-categories</option>
                    {(draftCategory
                      ? categories[draftCategory as keyof typeof categories]
                      : []
                    ).map((subCategory) => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience level
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {experienceLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDraftLevel(draftLevel === level ? '' : level)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          draftLevel === level
                            ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                            : 'border-gray-300 hover:border-cyan-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSearch}
                  className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {hasSearched && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Search Results</h3>
                <p className="text-sm text-gray-500">
                  {results.length} profile{results.length === 1 ? '' : 's'} found
                </p>
              </div>

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
                            <svg
                              className="w-8 h-8 md:w-10 md:h-10 text-cyan-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
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
                                <button
                                  key={`${skill}-${idx}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/user/${user.id}/skills`);
                                  }}
                                  className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-cyan-200 transition-colors"
                                >
                                  {skill}
                                </button>
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
            </>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}