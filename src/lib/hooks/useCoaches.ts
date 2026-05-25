import { useEffect, useState } from 'react';
import { fetchCoaches, CoachFilters } from '@/lib/api/coaches';
import { Coach } from '@/lib/definitions';

type UseCoachesResult = {
  coaches: Coach[];
  totalPages: number;
  loading: boolean;
  error: string | null;
};

export function useCoaches(
  page: number,
  size: number,
  filters: CoachFilters = {},
  enabled: boolean = true
): UseCoachesResult {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCoaches(page - 1, size, filters);
        if (!cancelled) {
          setCoaches(data._embedded?.content ?? []);
          setTotalPages(data.page.totalPages);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load coaches');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [page, size, enabled, filters.q, filters.seasonYear]); // eslint-disable-line react-hooks/exhaustive-deps

  return { coaches, totalPages, loading, error };
}
