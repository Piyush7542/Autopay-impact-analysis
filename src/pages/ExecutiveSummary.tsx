import { TrendingUp, TrendingDown, Users, CreditCard, CheckSquare, Activity, AlertTriangle, RefreshCw, Target } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from '@/components/ui/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { CohortComparison } from '@/components/dashboard/CohortComparison';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { useCohortData } from '@/hooks/useCohortData';
import { formatNumber, formatPercentage, formatRatio } from '@/utils/formatters';
import { COHORT_LABELS, COHORT_COLORS } from '@/utils/constants';
import type { CohortSummary } from '@/types';

export function ExecutiveSummary() {
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

  // Compute key metrics
  const adopter = cohortSummary.find(c => c.cohort === 'Adopter');
  const enabled = cohortSummary.find(c => c.cohort === 'Enabled_Inactive');
  const nonAdopter = cohortSummary.find(c => c.cohort === 'Non_Adopter');

  const totalProperties = cohortSummary.reduce((sum, c) => sum + c.property_count, 0);
  const avgSmPayUsage = cohortSummary.reduce((sum, c) => sum + c.sm_pay_usage_rate * c.property_count, 0) / totalProperties;
  const avgActiveRate = cohortSummary.reduce((sum, c) => sum + c.active_rate * c.property_count, 0) / totalProperties;
  const avgPreCheckin = cohortSummary.reduce((sum, c) => sum + c.pre_checkin_coverage_rate * c.property_count, 0) / totalProperties;

  // Key ratios
  const smPayRatio = adopter && enabled ? adopter.sm_pay_usage_rate / enabled.sm_pay_usage_rate : 0;
  const preCheckinRatio = adopter && enabled ? adopter.pre_checkin_coverage_rate / enabled.pre_checkin_coverage_rate : 0;
  const activeRatio = adopter && enabled ? adopter.active_rate / enabled.active_rate : 0;

  // Monthly trends for charts
  const trendData = filteredTrends.length ? filteredTrends : monthlyTrends;
  
  // Prepare cohort comparison data for bar chart
  const cohortBarData = cohortSummary.map(c => ({
    cohort: COHORT_LABELS[c.cohort],
    'SM Pay Usage': c.sm_pay_usage_rate,
    'Pre-Check-in Coverage': c.pre_checkin_coverage_rate,
    'Active Rate': c.active_rate,
    'Unpaid Stay Rate': c.unpaid_stay_rate,
  }));

  // Monthly trend data for line chart
  const months = [...new Set(trendData.map(t => t.month))].sort();
  const monthlyLineData = months.map(month => {
    const monthData = trendData.filter(t => t.month === month);
    return {
      month,
      ...Object.fromEntries(
        monthData.map(d => [COHORT_LABELS[d.cohort], d.sm_pay_usage_rate])
      ),
    };
  });

  // Donut chart data - property distribution
  const donutData = cohortSummary.map(c => ({
    name: COHORT_LABELS[c.cohort],
    value: c.property_count,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Executive Summary</h1>
          <p className="text-neutral-600 mt-1">
            AutoPay adoption analysis across {formatNumber(totalProperties)} properties (Mar 2025 – Feb 2026)
          </p>
        </div>
        <FilterBar
          filters={filters}
          onChange={useFilters().setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          label="Total Properties"
          value={totalProperties}
          format="number"
          icon={<Users className="w-8 h-8" />}
        />
        <KPICard
          label="Avg SM Pay Usage"
          value={avgSmPayUsage}
          format="percentage"
          icon={<CreditCard className="w-8 h-8" />}
        />
        <KPICard
          label="Avg Pre-Check-in Coverage"
          value={avgPreCheckin}
          format="percentage"
          icon={<CheckSquare className="w-8 h-8" />}
        />
        <KPICard
          label="Avg Active Rate"
          value={avgActiveRate}
          format="percentage"
          icon={<Activity className="w-8 h-8" />}
        />
        <KPICard
          label="Adopter vs Enabled SM Pay Ratio"
          value={smPayRatio}
          format="ratio"
          change={smPayRatio > 2.5 ? 15 : -5}
          icon={<Target className="w-8 h-8" />}
        />
      </div>

      {/* Adopter vs Enabled-Inactive Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Adopter vs Enabled-Inactive: Key Ratios</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="card p-4 text-center">
                <p className="text-3xl font-bold text-primary-600">{formatRatio(smPayRatio)}</p>
                <p className="text-sm text-neutral-500 mt-1">SM Pay Usage</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {adopter && enabled 
                    ? `${formatPercentage(adopter.sm_pay_usage_rate)} vs ${formatPercentage(enabled.sm_pay_usage_rate)}`
                    : '—'}
                </p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-3xl font-bold text-primary-600">{formatRatio(preCheckinRatio)}</p>
                <p className="text-sm text-neutral-500 mt-1">Pre-Check-in Coverage</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {adopter && enabled 
                    ? `${formatPercentage(adopter.pre_checkin_coverage_rate)} vs ${formatPercentage(enabled.pre_checkin_coverage_rate)}`
                    : '—'}
                </p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-3xl font-bold text-primary-600">{formatRatio(activeRatio)}</p>
                <p className="text-sm text-neutral-500 mt-1">Active Rate</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {adopter && enabled 
                    ? `${formatPercentage(adopter.active_rate)} vs ${formatPercentage(enabled.active_rate)}`
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Property Distribution</h2>
          </div>
          <div className="card-body">
            <DonutChart
              data={donutData}
              height={280}
              colors={cohortSummary.map(c => COHORT_COLORS[c.cohort])}
              label="Properties"
              total={totalProperties}
            />
          </div>
        </div>
      </div>

      {/* Cohort Comparison Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Cohort Comparison</h2>
        </div>
        <div className="card-body">
          <CohortComparison data={cohortSummary} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">SM Pay Usage by Cohort</h2>
          </div>
          <div className="card-body">
            <BarChart
              data={cohortBarData}
              xKey="cohort"
              yKeys={['SM Pay Usage', 'Pre-Check-in Coverage', 'Active Rate']}
              labels={['SM Pay Usage', 'Pre-Check-in Coverage', 'Active Rate']}
              colors={['#0ea5e9', '#10b981', '#f59e0b']}
              formatY={v => formatPercentage(v)}
              height={300}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">SM Pay Usage Trend (Monthly)</h2>
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
      </div>

      {/* Key Insights */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Key Insights</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightCard
              title="Adopters Drive Payment Adoption"
              description="Adopter properties show 2.9x higher SM Pay usage compared to enabled-but-inactive properties, confirming AutoPay significantly drives payment feature adoption."
              icon={<TrendingUp className="w-5 h-5" />}
              type="finding"
              metric="SM Pay Usage Ratio"
              value={formatRatio(smPayRatio)}
            />
            <InsightCard
              title="Pre-Check-in Coverage Gap"
              description="Adopters achieve ~5x pre-check-in coverage, demonstrating that automated payments enable seamless guest-facing workflows."
              icon={<CheckSquare className="w-5 h-5" />}
              type="opportunity"
              metric="Coverage Ratio"
              value={formatRatio(preCheckinRatio)}
            />
            <InsightCard
              title="Retention Advantage"
              description="Adopters maintain 59% active rate vs 23% for enabled-inactive — a 2.6x difference suggesting AutoPay increases product stickiness."
              icon={<RefreshCw className="w-5 h-5" />}
              type="success"
              metric="Active Rate Ratio"
              value={formatRatio(activeRatio)}
            />
            <InsightCard
              title="Revenue Protection"
              description="Adopters have 3% unpaid stay rate vs 12% for enabled-inactive, reducing revenue leakage through automated collection."
              icon={<CreditCard className="w-5 h-5" />}
              type="finding"
              metric="Unpaid Rate Reduction"
              value="4x lower"
            />
            <InsightCard
              title="Operational Efficiency"
              description="Adopters require 5x fewer manual payment interventions, freeing staff for guest service rather than payment follow-up."
              icon={<Activity className="w-5 h-5" />}
              type="opportunity"
              metric="Intervention Reduction"
              value="5x fewer"
            />
            <InsightCard
              title="Enabled-Inactive Risk"
              description="32% of properties are enabled but inactive — a significant opportunity for re-engagement campaigns and onboarding support."
              icon={<AlertTriangle className="w-5 h-5" />}
              type="risk"
              metric="Enabled-Inactive Share"
              value="32%"
            />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Recommendations</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <RecommendationCard
              title="Prioritize Enabled-Inactive Re-engagement"
              description="Launch targeted onboarding campaign for the 32% of properties that have AutoPay enabled but aren't using it. Provide dedicated support and incentives for first transaction."
              priority="high"
              effort="medium"
              impact="high"
              related_hypothesis="H1, H2, H5"
            />
            <RecommendationCard
              title="Bundle AutoPay + Pre-Check-in"
              description="Market AutoPay and pre-check-in as a combined 'Automated Arrival Experience' package. The 5x coverage difference shows strong synergy between these features."
              priority="high"
              effort="low"
              impact="high"
              related_hypothesis="H2"
            />
            <RecommendationCard
              title="Quantify Revenue Protection in Sales"
              description="Equip sales team with ROI calculator showing expected unpaid stay reduction (4x) and manual intervention savings (5x) per property."
              priority="medium"
              effort="low"
              impact="medium"
              related_hypothesis="H3, H4"
            />
            <RecommendationCard
              title="Track Cohort Retention Quarterly"
              description="Implement quarterly business review metrics tracking 12-month retention by cohort. Target at-risk enabled properties for proactive outreach."
              priority="medium"
              effort="medium"
              impact="medium"
              related_hypothesis="H5"
            />
            <RecommendationCard
              title="Non-Adopter Conversion Strategy"
              description="Develop targeted messaging for non-adopters highlighting peer benchmarks: 'Properties like yours see 2.9x payment adoption and 2.6x better retention with AutoPay.'"
              priority="medium"
              effort="medium"
              impact="high"
              related_hypothesis="H1, H5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}