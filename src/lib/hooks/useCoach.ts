import { useCallback, useEffect, useState } from 'react';
import { fetchCoach } from '@/lib/api/coaches';
import { Coach } from '@/lib/definitions';

type UseCoachResult = {
  coach: Coach | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useCoach(id: string): UseCoachResult {
  const [refreshKey, setRefreshKey] = useState(0);
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCoach(id);
        if (!cancelled) {
          setCoach(data);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load coach details');
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
  }, [id, refreshKey]);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  return { coach, loading, error, refresh };
}
