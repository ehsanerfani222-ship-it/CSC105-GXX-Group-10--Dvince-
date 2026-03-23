import { useNavigate } from 'react-router';
import { Edit, Calendar, Clock } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { getCurrentUserProfile } from '../data/appStorage';

export default function ViewOwnSkills() {
  const navigate = useNavigate();
  const skills = getCurrentUserProfile().skills;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <Header showBackButton onBackClick={() => navigate('/profile')} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">My Skills</h2>

          {skills.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-gray-500 mb-4">You have not added any skills yet.</p>
              <button
                onClick={() => navigate('/add-skill')}
                className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
              >
                Add Your First Skill
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{skill.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
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
                      </div>

                      <button
                        onClick={() => navigate('/add-skill')}
                        className="p-2 text-cyan-500 hover:bg-cyan-50 rounded-full transition-colors"
                        aria-label="Edit skill"
                      >
                        <Edit size={20} />
                      </button>
                    </div>

                    <p className="text-gray-700 mb-6">{skill.description}</p>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-gray-600 mb-1">Preferences</p>
                      <p className="font-medium text-gray-900">{skill.preferences || '-'}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={18} className="text-gray-600" />
                        <p className="text-sm font-medium text-gray-900">Schedule</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {skill.schedule.days.length > 0 ? (
                          skill.schedule.days.map((day) => (
                            <span key={day} className="bg-white px-3 py-1 rounded-full text-sm">
                              {day}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No days selected</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock size={16} />
                        <span>
                          {skill.schedule.timeStart || '--:--'} - {skill.schedule.timeEnd || '--:--'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/add-skill')}
                className="mt-6 w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
              >
                Add New Skill
              </button>
            </>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}