import { useState, useEffect } from 'react';

export function useHypothesisData() {
  const [hypotheses, setHypotheses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/data/hypothesis-results.json');
        if (!res.ok) throw new Error('Failed to load hypothesis data');
        const data = await res.json();
        setHypotheses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { hypotheses, loading, error };
}