import { ReferenceItem } from '@/lib/definitions';

let staffRolesCache: ReferenceItem[] | null = null;

export function resetStaffRolesCache(): void {
  staffRolesCache = null;
}

export async function fetchStaffRoles(): Promise<ReferenceItem[]> {
  if (staffRolesCache) return staffRolesCache;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/reference/staffrole`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch staff roles');
  }
  staffRolesCache = await response.json();
  return staffRolesCache!;
}
