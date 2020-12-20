import { createServiceFetch } from '@/lib/services';
import { User, UserProfile } from '@/types/user';

const fetch = createServiceFetch('user');

export async function getUserProfile(token: string, userId: User['id']) {
  const res = await fetch<UserProfile>({ path: ['profile', String(userId)], token });
  if (res.status !== 200) throw new Error('failed to fetch user profile');
  return res.json();
}
