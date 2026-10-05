// Core data types for AutoPay Impact Analysis

export type Cohort = 'Adopter' | 'Enabled_Inactive' | 'Non_Adopter';

export interface Property {
  property_id: string;
  property_name: string;
  country: string;
  region: string;
  property_type: string;
  total_rooms: number;
  signup_date: string; // ISO date
  cohort: Cohort;
  autopay_enabled_date?: string; // ISO date, only for Adopter/Enabled_Inactive
}

export interface MonthlyMetric {
  property_id: string;
  month: string; // YYYY-MM
  sm_pay_transactions: number;
  total_transactions: number;
  pre_checkins_completed: number;
  pre_checkins_eligible: number;
  unpaid_stays: number;
  total_stays: number;
  is_active: boolean;
  manual_interventions: number;
}

export interface CohortSummary {
  cohort: Cohort;
  property_count: number;
  avg_rooms: number;
  countries: string[];
  // Payment metrics
  sm_pay_usage_rate: number; // percentage
  avg_monthly_transactions: number;
  // Pre-check-in metrics
  pre_checkin_coverage_rate: number; // percentage
  avg_pre_checkins_per_property: number;
  // Active rate
  active_rate: number; // percentage
  avg_active_months: number;
  // Unpaid stays
  unpaid_stay_rate: number; // percentage
  avg_unpaid_stays_per_property: number;
  // Automation
  manual_intervention_rate: number; // percentage
  avg_interventions_per_property: number;
  // Retention
  retention_rate_12m: number; // percentage
  churn_rate: number; // percentage
}

export interface MonthlyTrend {
  month: string; // YYYY-MM
  cohort: Cohort;
  property_count: number;
  sm_pay_usage_rate: number;
  pre_checkin_coverage_rate: number;
  active_rate: number;
  unpaid_stay_rate: number;
  manual_intervention_rate: number;
}

export interface HypothesisResult {
  id: string;
  title: string;
  description: string;
  metric: string;
  adopter_value: number;
  comparison_value: number; // Enabled_Inactive or Non_Adopter
  comparison_cohort: Cohort;
  ratio: number; // adopter / comparison
  p_value: number;
  statistically_significant: boolean;
  conclusion: string;
  recommendation: string;
}

export interface KPICardData {
  label: string;
  value: string | number;
  change?: number; // percentage change
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'percentage' | 'currency' | 'ratio';
  description?: string;
}

export interface InsightCard {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  type: 'finding' | 'opportunity' | 'risk' | 'success';
  metric?: string;
  value?: string;
}

export interface RecommendationCard {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'high' | 'medium' | 'low';
  related_hypothesis?: string;
}

export interface FilterState {
  dateRange: { start: string; end: string };
  countries: string[];
  propertyTypes: string[];
  cohorts: Cohort[];
  roomRange: { min: number; max: number };
}

export const COHORT_LABELS: Record<Cohort, string> = {
  Adopter: 'Adopters',
  Enabled_Inactive: 'Enabled but Inactive',
  Non_Adopter: 'Non-Adopters',
};

export const COHORT_COLORS: Record<Cohort, string> = {
  Adopter: '#0ea5e9',        // primary-500
  Enabled_Inactive: '#f59e0b', // amber-500
  Non_Adopter: '#64748b',     // slate-500
};

export const COUNTRIES = [
  'Australia', 'New Zealand', 'United Kingdom', 'Ireland',
  'Singapore', 'Malaysia', 'Thailand', 'Indonesia',
  'United States', 'Canada', 'Mexico',
  'Germany', 'France', 'Spain', 'Italy',
  'South Africa', 'UAE', 'Japan',
];

export const PROPERTY_TYPES = [
  'Hotel', 'Resort', 'Motel', 'Hostel', 'Apartment', 'Boutique', 'Bed & Breakfast',
];