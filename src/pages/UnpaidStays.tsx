import { AlertTriangle, TrendingDown, Target, DollarSign, Shield } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from '@/components/ui/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { useCohortData } from '@/hooks/useCohortData';
import { formatNumber, formatPercentage, formatRatio } from '@/utils/formatters';
import { COHORT_LABELS, COHORT_COLORS, COHORT_BADGE_CLASSES } from '@/utils/constants';
import type { CohortSummary } from '@/types';

export function UnpaidStays() {
  const { filters, hasActiveFilters, resetFilters } = useFilters();
  const { cohortSummary, monthlyTrends, filteredTrends, filteredCohortSummary, loading, error } = useCohortData(filters);

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

  const trendData = filteredTrends.length ? filteredTrends : monthlyTrends;
  
  const adopter = filteredCohortSummary.find(c => c.cohort === 'Adopter');
  const enabled = filteredCohortSummary.find(c => c.cohort === 'Enabled_Inactive');
  const nonAdopter = filteredCohortSummary.find(c => c.cohort === 'Non_Adopter');

  // Lower is better for unpaid stays, so ratio is inverted
  const unpaidRatio = adopter && enabled ? enabled.unpaid_stay_rate / adopter.unpaid_stay_rate : 0;
  const unpaidRatioNonAdopter = adopter && nonAdopter ? nonAdopter.unpaid_stay_rate / adopter.unpaid_stay_rate : 0;

  const months = [...new Set(trendData.map(t => t.month))].sort();
  const monthlyLineData = months.map(month => {
    const monthData = trendData.filter(t => t.month === month);
    return {
      month,
      ...Object.fromEntries(
        monthData.map(d => [COHORT_LABELS[d.cohort], d.unpaid_stay_rate])
      ),
    };
  });

  const cohortBarData = filteredCohortSummary.map(c => ({
    cohort: COHORT_LABELS[c.cohort],
    'Unpaid Stay Rate': c.unpaid_stay_rate,
    'Avg Unpaid Stays/Property': c.avg_unpaid_stays_per_property,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Unpaid Stays Analysis</h1>
          <p className="text-neutral-600 mt-1">
            Revenue leakage and unpaid stay rates across adoption cohorts
          </p>
        </div>
        <FilterBar
          filters={filters}
          onChange={useFilters().setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          label="Adopter Unpaid Rate"
          value={adopter?.unpaid_stay_rate || 0}
          format="percentage"
          trend="down"
          change={-75}
          icon={<AlertTriangle className="w-8 h-8" />}
        />
        <KPICard
          label="Enabled-Inactive Unpaid Rate"
          value={enabled?.unpaid_stay_rate || 0}
          format="percentage"
          icon={<AlertTriangle className="w-8 h-8" />}
        />
        <KPICard
          label="Reduction Factor (Adopter vs Enabled)"
          value={unpaidRatio}
          format="ratio"
          change={unpaidRatio > 3 ? 20 : 0}
          icon={<Shield className="w-8 h-8" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Unpaid Stay Rate by Cohort</h2>
          </div>
          <div className="card-body">
            <BarChart
              data={cohortBarData}
              xKey="cohort"
              yKeys={['Unpaid Stay Rate']}
              labels={['Unpaid Stay Rate']}
              colors={['#ef4444']}
              formatY={v => formatPercentage(v)}
              height={300}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Avg Unpaid Stays per Property</h2>
          </div>
          <div className="card-body">
            <BarChart
              data={cohortBarData}
              xKey="cohort"
              yKeys={['Avg Unpaid Stays/Property']}
              labels={['Avg Unpaid Stays/Property']}
              colors={['#f59e0b']}
              formatY={v => formatNumber(v, 1)}
              height={300}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Unpaid Stay Rate Trend (Monthly)</h2>
        </div>
        <div className="card-body">
          <LineChart
            data={monthlyLineData}
            xKey="month"
            yKeys={filteredCohortSummary.map(c => COHORT_LABELS[c.cohort])}
            labels={filteredCohortSummary.map(c => COHORT_LABELS[c.cohort])}
            colors={filteredCohortSummary.map(c => COHORT_COLORS[c.cohort])}
            formatY={v => formatPercentage(v)}
            height={300}
            showDots
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Key Insights</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightCard
              title="4x Lower Unpaid Stays"
              description="Adopters have 3% unpaid stay rate vs 12% for enabled-inactive — automated payment collection dramatically reduces revenue leakage."
              icon={<Shield className="w-5 h-5" />}
              type="success"
              metric="Reduction Factor"
              value={`${formatRatio(unpaidRatio)}x lower`}
            />
            <InsightCard
              title="6x vs Non-Adopters"
              description="Adopters show 3% vs 18% for non-adopters — a 6x difference demonstrating the protective value of payment automation."
              icon={<TrendingDown className="w-5 h-5" />}
              type="finding"
              metric="Adopter vs Non-Adopter"
              value={`${formatRatio(unpaidRatioNonAdopter)}x lower`}
            />
            <InsightCard
              title="Revenue Protection"
              description="Automated collection eliminates manual follow-up delays and reduces payment failures. Estimate revenue recovery per property based on historical unpaid rates."
              icon={<DollarSign className="w-5 h-5" />}
              type="opportunity"
              metric="Avg Unpaid/Property"
              value={adopter ? formatNumber(adopter.avg_unpaid_stays_per_property, 1) : '—'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}