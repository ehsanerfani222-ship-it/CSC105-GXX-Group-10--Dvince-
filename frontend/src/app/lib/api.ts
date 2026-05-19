import type { Profile, Skill } from '../data/mockData';

export const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || 'http://localhost:5000';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(init.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch {}
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as unknown as T;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return undefined as unknown as T;
}

export const api = {
  get: <T = any>(p: string) => apiFetch<T>(p),
  post: <T = any>(p: string, body?: any) =>
    apiFetch<T>(p, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T = any>(p: string, body?: any) =>
    apiFetch<T>(p, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T = any>(p: string, body?: any) =>
    apiFetch<T>(p, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  del: <T = any>(p: string) => apiFetch<T>(p, { method: 'DELETE' }),
};

// ---- mappers ----

export function mapApiSkill(s: any): Skill {
  return {
    id: s.id,
    name: s.name || '',
    category: s.category || '',
    subCategory: s.subCategory || '',
    experienceLevel: s.experienceLevel || '',
    description: s.description || '',
    media: [],
    preferences: s.preferences || '',
    schedule: {
      days: s.schedule?.days || [],
      timeStart: s.schedule?.timeStart || '',
      timeEnd: s.schedule?.timeEnd || '',
    },
  };
}

export function mapApiUser(u: any): Profile {
  return {
    id: u.id,
    fullName: u.name || '',
    email: u.email || '',
    username: u.username || '',
    phoneNumber: u.phoneNumber || '',
    dateOfBirth: u.dateOfBirth || '',
    country: u.country || '',
    city: u.city || '',
    profilePicture: u.profilePicture || '',
    skills: Array.isArray(u.skills) ? u.skills.map(mapApiSkill) : [],
  };
}

export function skillToApiPayload(s: Skill) {
  return {
    name: s.name,
    category: s.category || null,
    subCategory: s.subCategory || null,
    experienceLevel: s.experienceLevel || null,
    description: s.description || null,
    preferences: s.preferences || null,
    schedule: {
      days: s.schedule?.days || [],
      timeStart: s.schedule?.timeStart || '',
      timeEnd: s.schedule?.timeEnd || '',
    },
  };
}

// Profile update payload uses backend field names (name, not fullName).
export function profileToApiPayload(p: Partial<Profile>) {
  const out: Record<string, any> = {};
  if (p.fullName !== undefined) out.name = p.fullName;
  if (p.username !== undefined) out.username = p.username;
  if (p.profilePicture !== undefined) out.profilePicture = p.profilePicture;
  if (p.phoneNumber !== undefined) out.phoneNumber = p.phoneNumber;
  if (p.dateOfBirth !== undefined) out.dateOfBirth = p.dateOfBirth;
  if (p.city !== undefined) out.city = p.city;
  if (p.country !== undefined) out.country = p.country;
  return out;
}
