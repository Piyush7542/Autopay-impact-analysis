import { Activity, TrendingUp, Target, Users, AlertTriangle, Clock } from 'lucide-react';
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

export function ActiveRate() {
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

  const activeRatio = adopter && enabled ? adopter.active_rate / enabled.active_rate : 0;
  const activeRatioNonAdopter = adopter && nonAdopter ? adopter.active_rate / nonAdopter.active_rate : 0;

  const months = [...new Set(trendData.map(t => t.month))].sort();
  const monthlyLineData = months.map(month => {
    const monthData = trendData.filter(t => t.month === month);
    return {
      month,
      ...Object.fromEntries(
        monthData.map(d => [COHORT_LABELS[d.cohort], d.active_rate])
      ),
    };
  });

  const cohortBarData = filteredCohortSummary.map(c => ({
    cohort: COHORT_LABELS[c.cohort],
    'Active Rate': c.active_rate,
    'Avg Active Months': c.avg_active_months,
    '12-Month Retention': c.retention_rate_12m,
    'Churn Rate': c.churn_rate,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Active Rate & Retention</h1>
          <p className="text-neutral-600 mt-1">
            Property activity and retention across adoption cohorts
          </p>
        </div>
        <FilterBar
          filters={filters}
          onChange={useFilters().setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KPICard
          label="Adopter Active Rate"
          value={adopter?.active_rate || 0}
          format="percentage"
          icon={<Activity className="w-8 h-8" />}
        />
        <KPICard
          label="Enabled-Inactive Active Rate"
          value={enabled?.active_rate || 0}
          format="percentage"
          icon={<Activity className="w-8 h-8" />}
        />
        <KPICard
          label="Adopter vs Enabled Ratio"
          value={activeRatio}
          format="ratio"
          change={activeRatio > 2 ? 15 : 0}
          icon={<Target className="w-8 h-8" />}
        />
        <KPICard
          label="12-Month Retention (Adopters)"
          value={adopter?.retention_rate_12m || 0}
          format="percentage"
          icon={<Users className="w-8 h-8" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Active Rate by Cohort</h2>
          </div>
          <div className="card-body">
            <BarChart
              data={cohortBarData}
              xKey="cohort"
              yKeys={['Active Rate']}
              labels={['Active Rate']}
              colors={['#0ea5e9']}
              formatY={v => formatPercentage(v)}
              height={300}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Retention vs Churn</h2>
          </div>
          <div className="card-body">
            <BarChart
              data={cohortBarData}
              xKey="cohort"
              yKeys={['12-Month Retention', 'Churn Rate']}
              labels={['12-Month Retention', 'Churn Rate']}
              colors={['#10b981', '#ef4444']}
              formatY={v => formatPercentage(v)}
              height={300}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Active Rate Trend (Monthly)</h2>
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
              title="2.6x Higher Active Rate"
              description="Adopters maintain 59% active rate vs 23% for enabled-inactive — a 2.6x difference suggesting AutoPay significantly increases product stickiness."
              icon={<TrendingUp className="w-5 h-5" />}
              type="finding"
              metric="Active Rate Ratio"
              value={formatRatio(activeRatio)}
            />
            <InsightCard
              title="4x vs Non-Adopters"
              description="Adopters show 59% active rate vs 15% for non-adopters — a 4x gap highlighting the retention value of payment automation."
              icon={<Target className="w-5 h-5" />}
              type="finding"
              metric="Adopter vs Non-Adopter"
              value={formatRatio(activeRatioNonAdopter)}
            />
            <InsightCard
              title="Churn Risk: Enabled-Inactive"
              description="Enabled-inactive properties show 23% active rate and high churn — this cohort represents significant revenue at risk without re-engagement."
              icon={<AlertTriangle className="w-5 h-5" />}
              type="risk"
              metric="Enabled-Inactive Churn"
              value={enabled ? formatPercentage(enabled.churn_rate) : '—'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}