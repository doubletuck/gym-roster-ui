import { Coach, PaginatedResponse } from '@/lib/definitions';

export type CoachFilters = {
  q?: string;
  seasonYear?: number;
};

export async function fetchCoaches(
  page: number,
  size: number,
  filters: CoachFilters = {}
): Promise<PaginatedResponse<Coach>> {
  let url = `${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/coach?page=${page}&size=${size}&sort=lastName,asc&sort=firstName,asc`;
  if (filters.q) url += `&q=${encodeURIComponent(filters.q)}`;
  if (filters.seasonYear != null) url += `&seasonYear=${filters.seasonYear}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch coaches');
  }
  return response.json();
}
