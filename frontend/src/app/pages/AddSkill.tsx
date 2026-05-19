import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowRight, Plus, X } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { categories, experienceLevels, type Skill } from '../data/mockData';
import { api, mapApiSkill, skillToApiPayload } from '../lib/api';

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
    schedule: { days: [], timeStart: '', timeEnd: '' },
  };
}

interface AddSkillLocationState {
  mode?: 'add' | 'edit';
  backPath?: string;
  nextPath?: string;
}

// IDs for newly-created (not-yet-saved) skills are generated client-side with
// Date.now(), giving values >= 1e12. Real backend IDs are small autoincrement
// integers. We treat anything >= NEW_ID_THRESHOLD as a brand-new skill.
const NEW_ID_THRESHOLD = 1_000_000_000;

export default function AddSkill() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationState = (location.state as AddSkillLocationState | null) ?? null;
  const isEditMode = navigationState?.mode === 'edit';
  const backPath = navigationState?.backPath ?? (isEditMode ? '/my-skills' : '/create-profile');
  const nextPath = navigationState?.nextPath ?? (isEditMode ? '/my-skills' : '/search');

  const [skills, setSkills] = useState<Skill[]>([createEmptySkill(Date.now())]);
  const [originalSkills, setOriginalSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<any[]>('/skills');
        const mapped = data.map(mapApiSkill);
        setOriginalSkills(mapped);
        setSkills(mapped.length > 0 ? mapped : [createEmptySkill(Date.now())]);
      } catch (e: any) {
        setError(e.message || 'Failed to load skills');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addNewSkill = () =>
    setSkills((current) => [...current, createEmptySkill(Date.now() + Math.random())]);

  const removeSkill = (id: number) => {
    if (skills.length > 1) setSkills(skills.filter((s) => s.id !== id));
  };

  const updateSkill = (id: number, field: keyof Skill, value: any) =>
    setSkills((current) => current.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const updateSchedule = (id: number, field: keyof Skill['schedule'], value: any) =>
    setSkills((current) =>
      current.map((s) => (s.id === id ? { ...s, schedule: { ...s.schedule, [field]: value } } : s))
    );

  const toggleDay = (skillId: number, day: string) =>
    setSkills((current) =>
      current.map((s) => {
        if (s.id !== skillId) return s;
        const days = s.schedule.days.includes(day)
          ? s.schedule.days.filter((d) => d !== day)
          : [...s.schedule.days, day];
        return { ...s, schedule: { ...s.schedule, days } };
      })
    );

  const handleFileUpload = (skillId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSkills((current) =>
          current.map((s) =>
            s.id === skillId ? { ...s, media: [...s.media, reader.result as string] } : s
          )
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const handleComplete = async () => {
    setSaving(true);
    setError('');
    try {
      const formIds = new Set(skills.map((s) => s.id));
      const toDelete = originalSkills.filter((o) => !formIds.has(o.id));

      // Delete removed skills.
      for (const s of toDelete) {
        await api.del(`/skills/${s.id}`);
      }

      // Create or update each form skill.
      for (const s of skills) {
        if (!s.name.trim()) continue; // skip blank rows
        const payload = skillToApiPayload(s);
        if (s.id < NEW_ID_THRESHOLD && originalSkills.some((o) => o.id === s.id)) {
          await api.put(`/skills/${s.id}`, payload);
        } else {
          await api.post('/skills', payload);
        }
      }

      navigate(nextPath);
    } catch (e: any) {
      setError(e.message || 'Failed to save skills');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => navigate(backPath);

  if (loading) {
    return (
      <PageLayout showBackButton onBackClick={handleBack}>
        <div className="text-center py-10 text-gray-500">Loading...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      showBackButton
      onBackClick={handleBack}
      mainClassName="container mx-auto px-4 md:px-6 lg:px-8 py-8 pb-24 lg:pb-8"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit Skills' : 'Add Your Skills'}
        </h2>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

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

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill {index + 1}</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                      placeholder="E.g., Guitar Playing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
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
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub-category</label>
                    <select
                      value={skill.subCategory}
                      onChange={(e) => updateSkill(skill.id, 'subCategory', e.target.value)}
                      disabled={!skill.category}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                    >
                      <option value="">Select a sub-category</option>
                      {subCategories.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                    <div className="flex gap-3">
                      {experienceLevels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => updateSkill(skill.id, 'experienceLevel', level)}
                          className={`flex-1 py-3 rounded-lg border-2 transition-all ${skill.experienceLevel === level
                            ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                            : 'border-gray-300 hover:border-cyan-300'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={skill.description}
                      onChange={(e) => updateSkill(skill.id, 'description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition resize-none"
                      placeholder="Describe your skill and what you can teach..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pictures/Videos</label>
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      <Plus size={20} />
                      Upload Media
                      <input type="file" accept="image/*,video/*" multiple className="hidden"
                        onChange={(e) => handleFileUpload(skill.id, e)} />
                    </label>
                    {skill.media.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {skill.media.map((item, idx) => (
                          <img key={idx} src={item} alt={`Upload ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferences</label>
                    <input
                      type="text"
                      value={skill.preferences}
                      onChange={(e) => updateSkill(skill.id, 'preferences', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                      placeholder="E.g., Online sessions preferred, beginner-friendly"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(skill.id, day)}
                          className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${skill.schedule.days.includes(day)
                            ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                            : 'border-gray-300 hover:border-cyan-300'}`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={skill.schedule.timeStart}
                        onChange={(e) => updateSchedule(skill.id, 'timeStart', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
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
            disabled={saving}
            className="bg-cyan-500 text-white p-4 rounded-full hover:bg-cyan-600 transition-colors shadow-lg disabled:opacity-60"
            aria-label={isEditMode ? 'Save edited skills' : 'Complete onboarding'}
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
