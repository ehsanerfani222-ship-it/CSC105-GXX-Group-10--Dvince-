import { useLocation, useNavigate, useParams } from 'react-router';
import { Calendar, Clock, MessageCircle } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { findProfile } from '../data/mockData';

// Shape of the router state passed from previous pages.
interface ViewUserSkillsLocationState {
  from?: string;
  searchState?: {
    showFilters: boolean;
    hasSearched: boolean;
    draftSearchQuery: string;
    draftCategory: string;
    draftSubCategory: string;
    draftLevel: string;
    searchQuery: string;
    selectedCategory: string;
    selectedSubCategory: string;
    selectedLevel: string;
  };
}

export default function ViewUserSkills() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const user = findProfile(id);

  // Read incoming router state so we can preserve the search state
  // when navigating back to the profile page.
  const navigationState =
    (location.state as ViewUserSkillsLocationState | null) ?? null;

  // Go back to the profile page, not directly to the search page.
  // Important: keep the original search state so the profile page
  // can still restore the previous search results when the user
  // clicks back again from there.
  const handleBack = () => {
    navigate(`/user/${user.id}`, {
      state: {
        from: navigationState?.from || '/search',
        searchState: navigationState?.searchState,
      },
    });
  };

  // Open the chat and keep the current page as the "from" route.
  const handleMessage = () => {
    navigate(`/chat/${user.id}`, {
      state: {
        from: `/user/${user.id}/skills`,
      },
    });
  };

  return (
    <PageLayout
      showBottomNav
      showBackButton
      onBackClick={handleBack}
      mainClassName="container mx-auto px-4 md:px-6 lg:px-8 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {user.fullName}'s Skills
            </h2>
            <p className="text-gray-600 mt-1">
              All skills are shown in separate cards.
            </p>
          </div>

          <button
            onClick={handleMessage}
            className="hidden sm:inline-flex bg-cyan-500 text-white px-4 py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold items-center gap-2"
          >
            <MessageCircle size={18} />
            Message
          </button>
        </div>

        <div className="space-y-6">
          {user.skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {skill.name}
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                  {skill.category}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {skill.subCategory}
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {skill.experienceLevel}
                </span>
              </div>

              <p className="text-gray-700 mb-6">{skill.description}</p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-1">Preferences</p>
                <p className="font-medium text-gray-900">{skill.preferences}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={18} className="text-gray-600" />
                  <p className="text-sm font-medium text-gray-900">Schedule</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {skill.schedule.days.map((day) => (
                    <span key={day} className="bg-white px-3 py-1 rounded-full text-sm">
                      {day}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock size={16} />
                  <span>
                    {skill.schedule.timeStart} - {skill.schedule.timeEnd}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleMessage}
          className="mt-6 sm:hidden w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <MessageCircle size={18} />
          Message
        </button>
      </div>
    </PageLayout>
  );
}