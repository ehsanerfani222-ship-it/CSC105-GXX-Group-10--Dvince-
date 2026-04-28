import { useNavigate } from 'react-router';
import { Search, MessageCircle, User, TrendingUp, Award, Clock, ChevronRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { getCurrentUserProfile } from '../data/appStorage';
import { profiles } from '../data/mockData';

export default function HomePage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUserProfile();

  // Get recent users (excluding current user)
  const recentUsers = profiles.filter(p => p.id !== 0).slice(0, 3);
  
  // Get trending skills
  const trendingSkills = ['Guitar', 'Spanish', 'Photography', 'Programming', 'Yoga'];

  return (
    <PageLayout showBottomNav mainClassName="container mx-auto px-4 md:px-6 lg:px-8 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, {currentUser.fullName.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Discover new skills and connect with experts</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate('/search')}
            className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <div className="bg-cyan-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Search size={22} className="text-cyan-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Find Skills</span>
          </button>

          <button
            onClick={() => navigate('/add-skill', { state: { mode: 'add', backPath: '/', nextPath: '/' } })}
            className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award size={22} className="text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Share Skill</span>
          </button>

          <button
            onClick={() => navigate('/chat')}
            className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageCircle size={22} className="text-purple-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Messages</span>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <User size={22} className="text-orange-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">My Profile</span>
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Recent People */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent People</h2>
              <button 
                onClick={() => navigate('/search')}
                className="text-cyan-500 text-sm flex items-center gap-1"
              >
                View all <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/user/${user.id}`)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                    <User size={22} className="text-cyan-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                    <p className="text-sm text-gray-500">{user.username}</p>
                  </div>
                  <button className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs">
                    Message
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Trending Skills */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-cyan-500" />
              <h2 className="text-lg font-bold text-gray-900">Trending Skills</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {trendingSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => navigate('/search', { state: { draftSearchQuery: skill } })}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-cyan-100 hover:text-cyan-700 transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-gray-500" />
                <h3 className="font-medium text-gray-700">Your Skills Summary</h3>
              </div>
              <p className="text-sm text-gray-600">
                You have <span className="font-bold text-cyan-600">{currentUser.skills.length}</span> skills listed.
                {currentUser.skills.length === 0 && " Add your first skill to get discovered!"}
              </p>
              {currentUser.skills.length === 0 && (
                <button
                  onClick={() => navigate('/add-skill')}
                  className="mt-3 text-cyan-500 text-sm font-medium"
                >
                  + Add a skill
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity / Suggested */}
        <div className="mt-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-2">💡 Pro Tip</h2>
          <p className="text-gray-700 text-sm">
            Complete your profile and add skills to get matched with learners and experts in your area.
            The more details you share, the better connections you'll make!
          </p>
        </div>
      </div>
    </PageLayout>
  );
}