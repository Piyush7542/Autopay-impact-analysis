import { cn } from '../../utils/cn';
import type { CohortSummary } from '../../types';
import { COHORT_LABELS, COHORT_COLORS, COHORT_BADGE_CLASSES } from '../../utils/constants';
import { formatNumber, formatPercentage } from '../../utils/formatters';

interface CohortComparisonProps {
  data: CohortSummary[];
  className?: string;
}

const METRICS = [
  { key: 'property_count', label: 'Properties', format: 'number' as const },
  { key: 'avg_rooms', label: 'Avg Rooms', format: 'number' as const },
  { key: 'sm_pay_usage_rate', label: 'SM Pay Usage', format: 'percentage' as const },
  { key: 'pre_checkin_coverage_rate', label: 'Pre-Check-in Coverage', format: 'percentage' as const },
  { key: 'active_rate', label: 'Active Rate', format: 'percentage' as const },
  { key: 'unpaid_stay_rate', label: 'Unpaid Stay Rate', format: 'percentage' as const },
  { key: 'manual_intervention_rate', label: 'Manual Intervention Rate', format: 'percentage' as const },
  { key: 'retention_rate_12m', label: '12-Month Retention', format: 'percentage' as const },
];

export function CohortComparison({ data, className = '' }: CohortComparisonProps) {
  const sortedData = [...data].sort((a, b) => {
    const order = { Adopter: 0, Enabled_Inactive: 1, Non_Adopter: 2 };
    return order[a.cohort] - order[b.cohort];
  });

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="table w-full">
        <thead>
          <tr>
            <th className="w-40">Cohort</th>
            {METRICS.map(m => (
              <th key={m.key} className="text-right">{m.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((cohort) => (
            <tr key={cohort.cohort}>
              <td className="font-medium">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COHORT_COLORS[cohort.cohort] }}
                    aria-hidden="true"
                  />
                  <span className={cn('badge', COHORT_BADGE_CLASSES[cohort.cohort])}>
                    {COHORT_LABELS[cohort.cohort]}
                  </span>
                </div>
              </td>
              {METRICS.map(metric => {
                const value = cohort[metric.key as keyof CohortSummary];
                let formatted: string;
                if (metric.format === 'percentage') {
                  formatted = formatPercentage(value as number);
                } else {
                  formatted = formatNumber(value as number, 1);
                }
                return (
                  <td key={metric.key} className="text-right font-mono text-neutral-700">
                    {formatted}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedData.map((cohort) => (
          <div 
            key={cohort.cohort} 
            className="card p-4 border-l-4"
            style={{ borderLeftColor: COHORT_COLORS[cohort.cohort] }}
          >
            <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: COHORT_COLORS[cohort.cohort] }}
              />
              {COHORT_LABELS[cohort.cohort]} Profile
            </h4>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Properties</span>
                <span className="font-medium">{formatNumber(cohort.property_count)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Avg Rooms</span>
                <span className="font-medium">{formatNumber(cohort.avg_rooms, 1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Countries</span>
                <span className="font-medium">{cohort.countries.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}