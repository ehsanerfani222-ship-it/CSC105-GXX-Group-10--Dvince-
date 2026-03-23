import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Plus, X } from 'lucide-react';
import Header from '../components/Header';
import { categories, experienceLevels, type Skill } from '../data/mockData';
import { getCurrentUserProfile, saveUserSkills } from '../data/appStorage';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function createEmptySkill(id: number): Skill {
  return {
    id,
    name: '',
    category: '',
    subCategory: '',
    experienceLevel: '',
    description: '',
    media: [],
    preferences: '',
    schedule: {
      days: [],
      timeStart: '',
      timeEnd: '',
    },
  };
}

export default function AddSkill() {
  const navigate = useNavigate();
  const existingSkills = getCurrentUserProfile().skills;

  const [skills, setSkills] = useState<Skill[]>(
    existingSkills.length > 0 ? existingSkills : [createEmptySkill(1)]
  );

  const addNewSkill = () => {
    setSkills((current) => [...current, createEmptySkill(Date.now())]);
  };

  const removeSkill = (id: number) => {
    if (skills.length > 1) {
      setSkills(skills.filter((skill) => skill.id !== id));
    }
  };

  const updateSkill = (id: number, field: keyof Skill, value: string | string[] | Skill['schedule']) => {
    setSkills((current) =>
      current.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill))
    );
  };

  const updateSchedule = (id: number, field: keyof Skill['schedule'], value: string | string[]) => {
    setSkills((current) =>
      current.map((skill) =>
        skill.id === id
          ? {
              ...skill,
              schedule: {
                ...skill.schedule,
                [field]: value,
              },
            }
          : skill
      )
    );
  };

  const toggleDay = (skillId: number, day: string) => {
    setSkills((current) =>
      current.map((skill) => {
        if (skill.id !== skillId) return skill;

        const days = skill.schedule.days.includes(day)
          ? skill.schedule.days.filter((d) => d !== day)
          : [...skill.schedule.days, day];

        return {
          ...skill,
          schedule: {
            ...skill.schedule,
            days,
          },
        };
      })
    );
  };

  const handleFileUpload = (skillId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSkills((current) =>
          current.map((skill) =>
            skill.id === skillId
              ? { ...skill, media: [...skill.media, reader.result as string] }
              : skill
          )
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const handleComplete = () => {
    saveUserSkills(skills);
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton onBackClick={() => navigate('/create-profile')} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Add Your Skills
          </h2>

          <div className="space-y-6">
            {skills.map((skill, index) => {
              const subCategories =
                skill.category && skill.category in categories
                  ? categories[skill.category as keyof typeof categories]
                  : [];

              return (
                <div key={skill.id} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 relative">
                  {skills.length > 1 && (
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Remove skill"
                    >
                      <X size={20} />
                    </button>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Skill {index + 1}
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skill Name
                      </label>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                        placeholder="E.g., Guitar Playing"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={skill.category}
                        onChange={(e) => {
                          updateSkill(skill.id, 'category', e.target.value);
                          updateSkill(skill.id, 'subCategory', '');
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                      >
                        <option value="">Select a category</option>
                        {Object.keys(categories).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub-category
                      </label>
                      <select
                        value={skill.subCategory}
                        onChange={(e) => updateSkill(skill.id, 'subCategory', e.target.value)}
                        disabled={!skill.category}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                      >
                        <option value="">Select a sub-category</option>
                        {subCategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level
                      </label>
                      <div className="flex gap-3">
                        {experienceLevels.map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => updateSkill(skill.id, 'experienceLevel', level)}
                            className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                              skill.experienceLevel === level
                                ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                : 'border-gray-300 hover:border-cyan-300'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={skill.description}
                        onChange={(e) => updateSkill(skill.id, 'description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition resize-none"
                        placeholder="Describe your skill and what you can teach..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pictures/Videos
                      </label>
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        <Plus size={20} />
                        Upload Media
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileUpload(skill.id, e)}
                        />
                      </label>

                      {skill.media.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {skill.media.map((item, idx) => (
                            <img
                              key={idx}
                              src={item}
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferences
                      </label>
                      <input
                        type="text"
                        value={skill.preferences}
                        onChange={(e) => updateSkill(skill.id, 'preferences', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                        placeholder="E.g., Online sessions preferred, beginner-friendly"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Days
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {daysOfWeek.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(skill.id, day)}
                            className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                              skill.schedule.days.includes(day)
                                ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                : 'border-gray-300 hover:border-cyan-300'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={skill.schedule.timeStart}
                          onChange={(e) => updateSchedule(skill.id, 'timeStart', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={skill.schedule.timeEnd}
                          onChange={(e) => updateSchedule(skill.id, 'timeEnd', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={addNewSkill}
            className="mt-6 w-full bg-white border-2 border-cyan-500 text-cyan-500 py-3 rounded-lg hover:bg-cyan-50 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Another Skill
          </button>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleComplete}
              className="bg-cyan-500 text-white p-4 rounded-full hover:bg-cyan-600 transition-colors shadow-lg"
              aria-label="Complete onboarding"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}