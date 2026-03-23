export const categories = {
  Music: ['Guitar', 'Piano', 'Violin', 'Drums', 'Singing'],
  Language: ['English', 'Spanish', 'French', 'German', 'Mandarin'],
  Art: ['Painting', 'Drawing', 'Sculpture', 'Photography', 'Digital Art'],
  Sports: ['Football', 'Basketball', 'Tennis', 'Swimming', 'Yoga'],
  Technology: ['Programming', 'Web Design', 'Data Science', 'Mobile Development'],
} as const;

export const experienceLevels = ['Beginner', 'Advanced', 'Master'] as const;

export type ExperienceLevel = (typeof experienceLevels)[number];
export type Category = keyof typeof categories;

export interface Skill {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  experienceLevel: string;
  description: string;
  media: string[];
  preferences: string;
  schedule: {
    days: string[];
    timeStart: string;
    timeEnd: string;
  };
}

export interface Profile {
  id: number;
  profilePicture?: string;
  fullName: string;
  email?: string;
  username: string;
  phoneNumber?: string;
  dateOfBirth: string;
  country: string;
  city: string;
  skills: Skill[];
}

export const profiles: Profile[] = [
  {
    id: 1,
    fullName: 'Michael Chen',
    username: '@michaelchen',
    dateOfBirth: 'June 22, 1995',
    country: 'United States',
    city: 'New York',
    skills: [
      {
        id: 11,
        name: 'Piano Coaching',
        category: 'Music',
        subCategory: 'Piano',
        experienceLevel: 'Advanced',
        description: 'I help learners build confidence with chords, sight-reading, and musicality.',
        media: [],
        preferences: 'Structured weekly sessions',
        schedule: { days: ['Monday', 'Thursday'], timeStart: '17:00', timeEnd: '20:00' },
      },
      {
        id: 12,
        name: 'Music Theory',
        category: 'Music',
        subCategory: 'Piano',
        experienceLevel: 'Master',
        description: 'From scales to harmony, I can break theory into simple and practical steps.',
        media: [],
        preferences: 'Theory mixed with exercises',
        schedule: { days: ['Saturday'], timeStart: '10:00', timeEnd: '14:00' },
      },
    ],
  },
  {
    id: 2,
    fullName: 'Emilia Rodriguez',
    username: '@emiliarodriguez',
    dateOfBirth: 'October 03, 1997',
    country: 'Spain',
    city: 'Barcelona',
    skills: [
      {
        id: 21,
        name: 'German Conversation',
        category: 'Language',
        subCategory: 'German',
        experienceLevel: 'Advanced',
        description: 'Practice speaking with helpful prompts, vocabulary drills, and confidence-building conversations.',
        media: [],
        preferences: 'Friendly, conversation-first sessions',
        schedule: { days: ['Tuesday', 'Friday'], timeStart: '14:00', timeEnd: '18:00' },
      },
      {
        id: 22,
        name: 'Painting for Beginners',
        category: 'Art',
        subCategory: 'Painting',
        experienceLevel: 'Master',
        description: 'I teach color, brushwork, and composition through small guided painting projects.',
        media: [],
        preferences: 'Hands-on assignments',
        schedule: { days: ['Sunday'], timeStart: '09:00', timeEnd: '12:00' },
      },
    ],
  },
  {
    id: 3,
    fullName: 'David Lee',
    username: '@davidlee',
    dateOfBirth: 'January 11, 2000',
    country: 'United Kingdom',
    city: 'London',
    skills: [
      {
        id: 31,
        name: 'Guitar Basics',
        category: 'Music',
        subCategory: 'Guitar',
        experienceLevel: 'Beginner',
        description: 'A relaxed introduction to chords, rhythm, and your first complete songs.',
        media: [],
        preferences: 'Beginner-friendly and patient',
        schedule: { days: ['Wednesday'], timeStart: '18:00', timeEnd: '20:00' },
      },
    ],
  },
  {
    id: 4,
    fullName: 'Sophia Kim',
    username: '@sophiakim',
    dateOfBirth: 'August 19, 1994',
    country: 'South Korea',
    city: 'Seoul',
    skills: [
      {
        id: 41,
        name: 'Digital Photography',
        category: 'Art',
        subCategory: 'Photography',
        experienceLevel: 'Advanced',
        description: 'I teach lighting, framing, and mobile editing workflows for clean social-ready photos.',
        media: [],
        preferences: 'Portfolio-based feedback',
        schedule: { days: ['Monday', 'Saturday'], timeStart: '11:00', timeEnd: '15:00' },
      },
    ],
  },
  {
    id: 5,
    fullName: 'Sophia Sandra',
    username: '@sophiasandra',
    dateOfBirth: 'August 12, 1994',
    country: 'South Korea',
    city: 'Seoul',
    skills: [
      {
        id: 51,
        name: 'Guitar Basics',
        category: 'Music',
        subCategory: 'Guitar',
        experienceLevel: 'Beginner',
        description: 'A relaxed introduction to chords, rhythm, and your first complete songs.',
        media: [],
        preferences: 'Beginner-friendly and patient',
        schedule: { days: ['Wednesday'], timeStart: '18:00', timeEnd: '20:00' },
      }
    ],
  },
];

export function findProfile(id?: string) {
  return profiles.find((profile) => String(profile.id) === id) ?? profiles[0];
}

export function filterProfiles({
  query,
  category,
  subCategory,
  experienceLevel,
}: {
  query: string;
  category: string;
  subCategory: string;
  experienceLevel: string;
}) {
  const normalizedQuery = query.trim().toLowerCase();

  return profiles.filter((profile) => {
    const matchesQuery =
      !normalizedQuery ||
      profile.fullName.toLowerCase().includes(normalizedQuery) ||
      profile.username.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      !category || profile.skills.some((skill) => skill.category === category);

    const matchesSubCategory =
      !subCategory || profile.skills.some((skill) => skill.subCategory === subCategory);

    const matchesExperience =
      !experienceLevel ||
      profile.skills.some((skill) => skill.experienceLevel === experienceLevel);

    return matchesQuery && matchesCategory && matchesSubCategory && matchesExperience;
  });
}