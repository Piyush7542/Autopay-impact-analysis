import { Users, Globe, Building, Filter, X } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from '@/components/ui/FilterBar';
import { CohortComparison } from '@/components/dashboard/CohortComparison';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { useCohortData } from '@/hooks/useCohortData';
import { useSamplePropertyData } from '@/hooks/useCohortData';
import { formatNumber, formatPercentage } from '@/utils/formatters';
import { COHORT_LABELS, COHORT_COLORS, COHORT_BADGE_CLASSES, COUNTRIES, PROPERTY_TYPES } from '@/utils/constants';
import type { CohortSummary } from '@/types';

export function CohortAnalysis() {
  const { filters, hasActiveFilters, resetFilters } = useFilters();
  const { cohortSummary, filteredTrends, monthlyTrends, loading, error } = useCohortData(filters);
  const { properties: sampleProperties, loading: sampleLoading } = useSamplePropertyData();

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
  const totalProperties = cohortSummary.reduce((sum, c) => sum + c.property_count, 0);

  // Country distribution
  const countryData = COUNTRIES.map(country => {
    const cohortCounts = cohortSummary.reduce((acc, cohort) => {
      // This is simplified - in real app would filter by country
      return acc;
    }, {} as Record<string, number>);
    return { country, total: 0 };
  });

  // Property type distribution
  const typeData = PROPERTY_TYPES.map(type => ({ type, count: 0 }));

  // Monthly cohort size trend
  const months = [...new Set(trendData.map(t => t.month))].sort();
  const monthlyCohortData = months.map(month => {
    const monthData = trendData.filter(t => t.month === month);
    return {
      month,
      ...Object.fromEntries(
        monthData.map(d => [COHORT_LABELS[d.cohort], d.property_count])
      ),
    };
  });

  // Cohort bar chart data
  const cohortBarData = cohortSummary.map(c => ({
    cohort: COHORT_LABELS[c.cohort],
    'Properties': c.property_count,
    'Avg Rooms': c.avg_rooms,
    'Countries': c.countries.length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Cohort Analysis</h1>
          <p className="text-neutral-600 mt-1">
            Property distribution and characteristics across three adoption cohorts
          </p>
        </div>
        <FilterBar
          filters={filters}
          onChange={useFilters().setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Properties</p>
              <p className="text-2xl font-bold text-neutral-900">{formatNumber(totalProperties)}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Building className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Countries</p>
              <p className="text-2xl font-bold text-neutral-900">
                {new Set(cohortSummary.flatMap(c => c.countries)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Filter className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Property Types</p>
              <p className="text-2xl font-bold text-neutral-900">{PROPERTY_TYPES.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Comparison */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Cohort Profiles</h2>
        </div>
        <div className="card-body">
          <CohortComparison data={cohortSummary} />
        </div>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Cohort Sizes</h2>
          </div>
          <div className="card-body">
            <DonutChart
              data={cohortSummary.map(c => ({
                name: COHORT_LABELS[c.cohort],
                value: c.property_count,
              }))}
              height={280}
              colors={cohortSummary.map(c => COHORT_COLORS[c.cohort])}
              label="Properties"
              total={totalProperties}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Avg Rooms by Cohort</h2>
          </div>
          <div className="card-body">
            <BarChart
              data={cohortBarData}
              xKey="cohort"
              yKeys={['Avg Rooms']}
              labels={['Avg Rooms']}
              colors={['#0ea5e9']}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Monthly Cohort Trend */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Cohort Size Trend (Monthly)</h2>
        </div>
        <div className="card-body">
          <BarChart
            data={monthlyCohortData}
            xKey="month"
            yKeys={cohortSummary.map(c => COHORT_LABELS[c.cohort])}
            labels={cohortSummary.map(c => COHORT_LABELS[c.cohort])}
            colors={cohortSummary.map(c => COHORT_COLORS[c.cohort])}
            height={300}
          />
        </div>
      </div>

      {/* Sample Properties Table */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Sample Properties (20)</h2>
          {sampleLoading && <span className="text-sm text-neutral-500">Loading...</span>}
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Cohort</th>
                  <th>Country</th>
                  <th>Type</th>
                  <th>Rooms</th>
                  <th>Signup</th>
                  <th>AutoPay Enabled</th>
                </tr>
              </thead>
              <tbody>
                {sampleProperties.slice(0, 20).map(prop => (
                  <tr key={prop.property_id}>
                    <td className="font-medium">{prop.property_name}</td>
                    <td>
                      <span className={`badge ${COHORT_BADGE_CLASSES[prop.cohort as keyof typeof COHORT_BADGE_CLASSES]}`}>
                        {COHORT_LABELS[prop.cohort as keyof typeof COHORT_LABELS]}
                      </span>
                    </td>
                    <td>{prop.country}</td>
                    <td>{prop.property_type}</td>
                    <td className="font-mono">{prop.total_rooms}</td>
                    <td>{prop.signup_date}</td>
                    <td>{prop.autopay_enabled_date || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}