import type { Profile, Skill } from './mockData';

// Storage keys used by the app.
const ACCOUNTS_KEY = 'dvince_accounts';
const PROFILES_KEY = 'dvince_profiles';
const SESSION_KEY = 'dvince_session';

// Registered account shape.
interface RegisteredAccount {
  fullName: string;
  email: string;
  password: string;
}

// Stored profile shape for one user.
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

// Session data stores which email is currently logged in.
interface SessionData {
  isLoggedIn: boolean;
  email: string;
}

// Generic helper to safely read JSON from localStorage.
function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// Normalize emails so lookups are consistent.
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Read all registered accounts as a map by normalized email.
function getAccountsMap(): Record<string, RegisteredAccount> {
  return readJson<Record<string, RegisteredAccount>>(ACCOUNTS_KEY) ?? {};
}

// Save all registered accounts.
function saveAccountsMap(accounts: Record<string, RegisteredAccount>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

// Read all stored profiles as a map by normalized email.
function getProfilesMap(): Record<string, StoredUserProfile> {
  return readJson<Record<string, StoredUserProfile>>(PROFILES_KEY) ?? {};
}

// Save all stored profiles.
function saveProfilesMap(profiles: Record<string, StoredUserProfile>) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

// Read the current session.
function getSession(): SessionData | null {
  return readJson<SessionData>(SESSION_KEY);
}

// Returns the currently logged-in user's normalized email.
function getCurrentSessionEmail(): string | null {
  const session = getSession();

  if (!session?.isLoggedIn || !session.email) {
    return null;
  }

  return normalizeEmail(session.email);
}

// Export the current logged-in email for other storage modules.
export function getCurrentUserEmail(): string | null {
  return getCurrentSessionEmail();
}

// Create an empty profile for a specific account.
// This is important when a brand-new user registers.
function createEmptyProfile(account: Pick<RegisteredAccount, 'fullName' | 'email'>): StoredUserProfile {
  return {
    fullName: account.fullName,
    email: account.email,
    username: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: '',
    city: '',
    profilePicture: '',
    skills: [],
  };
}

// Save or update one registered account.
export function saveRegisteredAccount(account: RegisteredAccount) {
  const emailKey = normalizeEmail(account.email);
  const accounts = getAccountsMap();

  accounts[emailKey] = {
    ...account,
    email: account.email.trim(),
    fullName: account.fullName.trim(),
  };

  saveAccountsMap(accounts);
}

// Get one registered account by email.
export function getRegisteredAccountByEmail(email: string): RegisteredAccount | null {
  const accounts = getAccountsMap();
  return accounts[normalizeEmail(email)] ?? null;
}

// Returns true if an account already exists for the given email.
export function doesAccountExist(email: string): boolean {
  return Boolean(getRegisteredAccountByEmail(email));
}

// Get the currently logged-in account.
export function getCurrentRegisteredAccount(): RegisteredAccount | null {
  const currentEmail = getCurrentSessionEmail();
  if (!currentEmail) return null;

  const accounts = getAccountsMap();
  return accounts[currentEmail] ?? null;
}

// Validate sign-in against the account belonging to the entered email.
export function isValidSignIn(email: string, password: string) {
  const account = getRegisteredAccountByEmail(email);
  if (!account) return false;

  return account.password === password;
}

// Save profile data for the currently logged-in user.
export function saveUserProfile(profile: Partial<StoredUserProfile>) {
  const currentEmail = getCurrentSessionEmail();

  // Without a logged-in user, there is no safe place to store the profile.
  if (!currentEmail) return;

  const profiles = getProfilesMap();
  const current = profiles[currentEmail];

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

  profiles[currentEmail] = nextProfile;
  saveProfilesMap(profiles);
}

// Get the stored profile for the currently logged-in user.
export function getStoredUserProfile(): StoredUserProfile | null {
  const currentEmail = getCurrentSessionEmail();
  if (!currentEmail) return null;

  const profiles = getProfilesMap();
  return profiles[currentEmail] ?? null;
}

// Save skills for the currently logged-in user.
export function saveUserSkills(skills: Skill[]) {
  const current = getStoredUserProfile();

  saveUserProfile({
    ...(current ?? {}),
    skills,
  });
}

// Return the merged current user profile used by the UI.
export function getCurrentUserProfile(): Profile {
  const account = getCurrentRegisteredAccount();
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

// Log in a specific user by email.
export function setUserLoggedIn(email: string) {
  const session: SessionData = {
    isLoggedIn: true,
    email: normalizeEmail(email),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Register a new user and initialize an empty profile.
// Returns false if the email already exists.
export function registerAndInitializeUser(account: RegisteredAccount): boolean {
  if (doesAccountExist(account.email)) {
    return false;
  }

  saveRegisteredAccount(account);
  setUserLoggedIn(account.email);

  const profiles = getProfilesMap();
  const emailKey = normalizeEmail(account.email);

  profiles[emailKey] = createEmptyProfile({
    fullName: account.fullName,
    email: account.email,
  });

  saveProfilesMap(profiles);

  return true;
}

// Clear only the session, not all users' stored data.
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

// Check if a valid session exists.
export function isUserLoggedIn() {
  const session = getSession();
  return Boolean(session?.isLoggedIn && session.email);
}