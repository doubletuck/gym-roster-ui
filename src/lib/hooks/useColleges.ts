import { useEffect, useState } from 'react';
import { fetchColleges } from '@/lib/api/colleges';
import { College } from '@/lib/definitions';

type UseCollegesResult = {
  colleges: College[];
  loading: boolean;
  error: string | null;
};

export function useColleges(enabled = true): UseCollegesResult {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const data = await fetchColleges();
        if (!cancelled) setColleges(data.content);
      } catch {
        if (!cancelled) setError('Failed to load colleges');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { colleges, loading, error };
}
