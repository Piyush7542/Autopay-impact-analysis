import { useState, useEffect, useCallback } from 'react';
import type { CohortSummary, MonthlyTrend, FilterState, Cohort } from '../types';

interface CohortData {
  cohortSummary: CohortSummary[];
  monthlyTrends: MonthlyTrend[];
  loading: boolean;
  error: string | null;
  filteredTrends: MonthlyTrend[];
}

export function useCohortData(filters: FilterState): CohortData {
  const [cohortSummary, setCohortSummary] = useState<CohortSummary[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [summaryRes, trendsRes] = await Promise.all([
        fetch('/data/cohort-summary.json'),
        fetch('/data/monthly-trends.json'),
      ]);
      
      if (!summaryRes.ok || !trendsRes.ok) {
        throw new Error('Failed to load data');
      }
      
      const summary = await summaryRes.json();
      const trends = await trendsRes.json();
      
      setCohortSummary(summary);
      setMonthlyTrends(trends);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply filters to monthly trends
  const filteredTrends = monthlyTrends.filter(trend => {
    const monthNum = trend.month;
    if (monthNum < filters.dateRange.start || monthNum > filters.dateRange.end) {
      return false;
    }
    if (filters.cohorts.length > 0 && !filters.cohorts.includes(trend.cohort as Cohort)) {
      return false;
    }
    return true;
  });

  return {
    cohortSummary,
    monthlyTrends,
    filteredTrends,
    loading,
    error,
  };
}

interface HypothesisData {
  hypotheses: any[];
  loading: boolean;
  error: string | null;
}

export function useHypothesisData(): HypothesisData {
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

interface SamplePropertyData {
  properties: any[];
  loading: boolean;
  error: string | null;
}

export function useSamplePropertyData(): SamplePropertyData {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/data/sample-properties.json');
        if (!res.ok) throw new Error('Failed to load sample properties');
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { properties, loading, error };
}