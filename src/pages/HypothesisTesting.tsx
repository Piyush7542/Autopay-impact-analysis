import { FlaskConical, CheckCircle, XCircle, Info, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from '@/components/ui/FilterBar';
import { HypothesisCard } from '@/components/dashboard/HypothesisCard';
import { useHypothesisData } from '@/hooks/useHypothesisData';
import { COHORT_LABELS } from '@/utils/constants';

export function HypothesisTesting() {
  const { filters, hasActiveFilters, resetFilters } = useFilters();
  const { hypotheses, loading, error } = useHypothesisData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-600">Error loading data: {error}</p>
      </div>
    );
  }

  const supportedCount = hypotheses.filter(h => h.statistically_significant && h.ratio > 1).length;
  const totalCount = hypotheses.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Hypothesis Testing</h1>
              <p className="text-neutral-600">Statistical validation of AutoPay impact across 5 key hypotheses</p>
            </div>
          </div>
        </div>
        <FilterBar
          filters={filters}
          onChange={useFilters().setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Hypotheses Supported</p>
              <p className="text-2xl font-bold text-green-600">{supportedCount} / {totalCount}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FlaskConical className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Statistical Significance</p>
              <p className="text-2xl font-bold text-primary-600">
                {hypotheses.filter(h => h.statistically_significant).length} / {totalCount}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Info className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Avg Effect Size (Ratio)</p>
              <p className="text-2xl font-bold text-amber-600">
                {hypotheses.length > 0 
                  ? (hypotheses.reduce((sum, h) => sum + h.ratio, 0) / hypotheses.length).toFixed(1) + 'x'
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hypothesis Cards */}
      <div className="space-y-4">
        {hypotheses.map((hypothesis) => (
          <HypothesisCard
            key={hypothesis.id}
            hypothesis={hypothesis}
            cohortLabels={COHORT_LABELS}
          />
        ))}
      </div>

      {/* Methodology Note */}
      <div className="card border-amber-200 bg-amber-50">
        <div className="card-body">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Methodology Note</h3>
              <p className="text-amber-700 mt-1 text-sm">
                All hypotheses tested using two-sample Welch's t-test (unequal variance) at α = 0.05 significance level.
                Ratios represent Adopter cohort mean / Enabled-Inactive cohort mean for the tested metric.
                Data is synthetic — generated for portfolio demonstration only. P-values and effect sizes are computed
                from the synthetic dataset and should not be interpreted as real SiteMinder results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}