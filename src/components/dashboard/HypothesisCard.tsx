import { CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';
import { formatPercentage, formatRatio } from '../../utils/formatters';

interface HypothesisCardProps {
  hypothesis: {
    id: string;
    title: string;
    description: string;
    metric: string;
    adopter_value: number;
    comparison_value: number;
    comparison_cohort: string;
    ratio: number;
    p_value: number;
    statistically_significant: boolean;
    conclusion: string;
    recommendation: string;
  };
  cohortLabels: Record<string, string>;
}

export function HypothesisCard({ hypothesis, cohortLabels }: HypothesisCardProps) {
  const [expanded, setExpanded] = useState(false);
  const supported = hypothesis.statistically_significant && hypothesis.ratio > 1;

  return (
    <div className={cn('hypothesis-card', supported ? 'hypothesis-supported' : 'hypothesis-not-supported')}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-neutral-900">{hypothesis.id}</span>
            <h4 className="text-lg font-medium text-neutral-900">{hypothesis.title}</h4>
            <span className={cn(
              'badge',
              supported ? 'badge-success' : 'badge-danger'
            )}>
              {supported ? 'Supported' : 'Not Supported'}
            </span>
          </div>
          <p className="mt-2 text-sm text-neutral-600">{hypothesis.description}</p>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="btn-ghost p-2 flex-shrink-0"
          aria-expanded={expanded}
          aria-controls={`hypothesis-${hypothesis.id}-details`}
        >
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <div id={`hypothesis-${hypothesis.id}-details`} className="mt-4 overflow-hidden transition-all duration-200" style={{ maxHeight: expanded ? '500px' : '0' }}>
        <div className="pt-4 border-t border-neutral-100 space-y-4">
          {/* Metric Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <p className="text-sm text-neutral-500">Adopters</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {formatPercentage(hypothesis.adopter_value)}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-neutral-500">{cohortLabels[hypothesis.comparison_cohort] || hypothesis.comparison_cohort}</p>
              <p className="text-2xl font-bold text-slate-600 mt-1">
                {formatPercentage(hypothesis.comparison_value)}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-neutral-500">Ratio</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                {formatRatio(hypothesis.ratio)}
              </p>
            </div>
          </div>

          {/* Statistical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-4">
              <p className="text-sm text-neutral-500">P-Value</p>
              <p className="text-xl font-bold text-neutral-900 mt-1">
                {hypothesis.p_value < 0.001 ? '< 0.001' : hypothesis.p_value.toFixed(4)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {hypothesis.p_value < 0.05 ? 'Statistically significant (p < 0.05)' : 'Not statistically significant (p ≥ 0.05)'}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-neutral-500">Metric Tested</p>
              <p className="text-sm font-medium text-neutral-900 mt-1">{hypothesis.metric}</p>
            </div>
          </div>

          {/* Conclusion */}
          <div className="card p-4 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Conclusion</p>
                <p className="text-green-700 mt-1 text-sm">{hypothesis.conclusion}</p>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="card p-4 bg-primary-50 border-primary-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-primary-800">Recommendation</p>
                <p className="text-primary-700 mt-1 text-sm">{hypothesis.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}