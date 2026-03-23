import type { Profile, Skill } from './mockData';

const REGISTERED_ACCOUNT_KEY = 'dvince_registered_account';
const USER_PROFILE_KEY = 'dvince_user_profile';
const SESSION_KEY = 'dvince_session';

interface RegisteredAccount {
  fullName: string;
  email: string;
  password: string;
}

interface StoredUserProfile {
  fullName: string;
  email: string;
  username: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
  city: string;
  profilePicture?: string;
  skills: Skill[];
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveRegisteredAccount(account: RegisteredAccount) {
  localStorage.setItem(REGISTERED_ACCOUNT_KEY, JSON.stringify(account));
}

export function getRegisteredAccount(): RegisteredAccount | null {
  return readJson<RegisteredAccount>(REGISTERED_ACCOUNT_KEY);
}

export function isValidSignIn(email: string, password: string) {
  const account = getRegisteredAccount();
  if (!account) return false;

  return (
    account.email.trim().toLowerCase() === email.trim().toLowerCase() &&
    account.password === password
  );
}

export function saveUserProfile(profile: Partial<StoredUserProfile>) {
  const current = getStoredUserProfile();

  const nextProfile: StoredUserProfile = {
    fullName: profile.fullName ?? current?.fullName ?? '',
    email: profile.email ?? current?.email ?? '',
    username: profile.username ?? current?.username ?? '',
    phoneNumber: profile.phoneNumber ?? current?.phoneNumber ?? '',
    dateOfBirth: profile.dateOfBirth ?? current?.dateOfBirth ?? '',
    country: profile.country ?? current?.country ?? '',
    city: profile.city ?? current?.city ?? '',
    profilePicture: profile.profilePicture ?? current?.profilePicture ?? '',
    skills: profile.skills ?? current?.skills ?? [],
  };

  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(nextProfile));
}

export function getStoredUserProfile(): StoredUserProfile | null {
  return readJson<StoredUserProfile>(USER_PROFILE_KEY);
}

export function saveUserSkills(skills: Skill[]) {
  const current = getStoredUserProfile();

  saveUserProfile({
    ...(current ?? {}),
    skills,
  });
}

export function getCurrentUserProfile(): Profile {
  const account = getRegisteredAccount();
  const profile = getStoredUserProfile();

  return {
    id: 0,
    fullName: profile?.fullName || account?.fullName || 'Your Name',
    email: profile?.email || account?.email || '',
    username: profile?.username || '@username',
    phoneNumber: profile?.phoneNumber || '',
    dateOfBirth: profile?.dateOfBirth || '',
    country: profile?.country || '',
    city: profile?.city || '',
    profilePicture: profile?.profilePicture || '',
    skills: profile?.skills || [],
  };
}

export function setUserLoggedIn() {
  localStorage.setItem(SESSION_KEY, 'true');
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function isUserLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === 'true';
}