import { CheckSquare, TrendingUp, Target, AlertTriangle } from 'lucide-react';
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

export function PreCheckinCoverage() {
  const { filters, hasActiveFilters, resetFilters } = useFilters();
  const { cohortSummary, monthlyTrends, filteredTrends, loading, error } = useCohortData(filters);

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
  
  const adopter = cohortSummary.find(c => c.cohort === 'Adopter');
  const enabled = cohortSummary.find(c => c.cohort === 'Enabled_Inactive');
  const nonAdopter = cohortSummary.find(c => c.cohort === 'Non_Adopter');

  const preCheckinRatio = adopter && enabled ? adopter.pre_checkin_coverage_rate / enabled.pre_checkin_coverage_rate : 0;
  const preCheckinRatioNonAdopter = adopter && nonAdopter ? adopter.pre_checkin_coverage_rate / nonAdopter.pre_checkin_coverage_rate : 0;

  const months = [...new Set(trendData.map(t => t.month))].sort();
  const monthlyLineData = months.map(month => {
    const monthData = trendData.filter(t => t.month === month);
    return {
      month,
      ...Object.fromEntries(
        monthData.map(d => [COHORT_LABELS[d.cohort], d.pre_checkin_coverage_rate])
      ),
    };
  });

  const cohortBarData = cohortSummary.map(c => ({
    cohort: COHORT_LABELS[c.cohort],
    'Pre-Check-in Coverage': c.pre_checkin_coverage_rate,
    'Avg Pre-Check-ins/Property': c.avg_pre_checkins_per_property,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Pre-Check-in Coverage</h1>
          <p className="text-neutral-600 mt-1">
            Guest pre-check-in completion rates across adoption cohorts
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
          label="Adopter Coverage"
          value={adopter?.pre_checkin_coverage_rate || 0}
          format="percentage"
          icon={<CheckSquare className="w-8 h-8" />}
        />
        <KPICard
          label="Enabled-Inactive Coverage"
          value={enabled?.pre_checkin_coverage_rate || 0}
          format="percentage"
          icon={<CheckSquare className="w-8 h-8" />}
        />
        <KPICard
          label="Adopter vs Enabled Ratio"
          value={preCheckinRatio}
          format="ratio"
          change={preCheckinRatio > 4 ? 20 : 0}
          icon={<Target className="w-8 h-8" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Pre-Check-in Coverage by Cohort</h2>
          </div>
          <div className="card-body">
            <BarChart
              data={cohortBarData}
              xKey="cohort"
              yKeys={['Pre-Check-in Coverage']}
              labels={['Pre-Check-in Coverage']}
              colors={['#10b981']}
              formatY={v => formatPercentage(v)}
              height={300}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Avg Pre-Check-ins per Property</h2>
          </div>
          <div className="card-body">
            <BarChart
              data={cohortBarData}
              xKey="cohort"
              yKeys={['Avg Pre-Check-ins/Property']}
              labels={['Avg Pre-Check-ins/Property']}
              colors={['#0ea5e9']}
              formatY={v => formatNumber(v, 1)}
              height={300}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Pre-Check-in Coverage Trend (Monthly)</h2>
        </div>
        <div className="card-body">
          <LineChart
            data={monthlyLineData}
            xKey="month"
            yKeys={cohortSummary.map(c => COHORT_LABELS[c.cohort])}
            labels={cohortSummary.map(c => COHORT_LABELS[c.cohort])}
            colors={cohortSummary.map(c => COHORT_COLORS[c.cohort])}
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
              title="5x Coverage Advantage"
              description="Adopters achieve ~5x pre-check-in coverage (75% vs 15%), demonstrating that AutoPay enables seamless guest-facing automation workflows."
              icon={<TrendingUp className="w-5 h-5" />}
              type="finding"
              metric="Coverage Ratio"
              value={formatRatio(preCheckinRatio)}
            />
            <InsightCard
              title="9x vs Non-Adopters"
              description="Adopters show 75% coverage vs 8% for non-adopters — a 9x gap showing that payment automation unlocks guest self-service."
              icon={<Target className="w-5 h-5" />}
              type="finding"
              metric="Adopter vs Non-Adopter"
              value={formatRatio(preCheckinRatioNonAdopter)}
            />
            <InsightCard
              title="Operational Impact"
              description="Higher pre-check-in rates reduce front desk workload, accelerate check-in times, and improve guest satisfaction scores."
              icon={<AlertTriangle className="w-5 h-5" />}
              type="opportunity"
              metric="Avg Pre-Check-ins"
              value={adopter ? formatNumber(adopter.avg_pre_checkins_per_property, 1) : '—'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}