import { CollegesPage } from '@/lib/definitions';

export async function fetchColleges(page = 0, size = 300): Promise<CollegesPage> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/college?page=${page}&size=${size}&sort=shortName,asc`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch colleges');
  }
  return response.json();
}
