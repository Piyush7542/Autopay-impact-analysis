// Application constants

export const APP_NAME = 'AutoPay Impact Analysis';
export const APP_TAGLINE = 'Product Analytics Portfolio Project';
export const SYNTHETIC_BADGE = 'SYNTHETIC DATA — PORTFOLIO DEMO';

export const MONTHS = [
  '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08',
  '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02',
];

export const COHORTS = ['Adopter', 'Enabled_Inactive', 'Non_Adopter'] as const;
export type Cohort = typeof COHORTS[number];

export const COHORT_LABELS: Record<Cohort, string> = {
  Adopter: 'Adopters',
  Enabled_Inactive: 'Enabled but Inactive',
  Non_Adopter: 'Non-Adopters',
};

export const COHORT_COLORS: Record<Cohort, string> = {
  Adopter: '#0ea5e9',
  Enabled_Inactive: '#f59e0b',
  Non_Adopter: '#64748b',
};

export const COHORT_COLOR_CLASSES: Record<Cohort, string> = {
  Adopter: 'bg-primary-500',
  Enabled_Inactive: 'bg-amber-500',
  Non_Adopter: 'bg-slate-500',
};

export const COHORT_BADGE_CLASSES: Record<Cohort, string> = {
  Adopter: 'bg-primary-100 text-primary-800',
  Enabled_Inactive: 'bg-amber-100 text-amber-800',
  Non_Adopter: 'bg-slate-100 text-slate-800',
};

export const PAGES = [
  { id: 'executive', label: 'Executive Summary', icon: 'layout-dashboard' },
  { id: 'cohorts', label: 'Cohort Analysis', icon: 'users' },
  { id: 'payments', label: 'Payment Usage', icon: 'credit-card' },
  { id: 'precheckin', label: 'Pre-Check-in Coverage', icon: 'check-square' },
  { id: 'active', label: 'Active Rate', icon: 'activity' },
  { id: 'unpaid', label: 'Unpaid Stays', icon: 'alert-triangle' },
  { id: 'retention', label: 'Retention Analysis', icon: 'refresh-cw' },
  { id: 'hypotheses', label: 'Hypothesis Testing', icon: 'flask-conical' },
  { id: 'about', label: 'About This Project', icon: 'info' },
] as const;

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

export const DEFAULT_FILTERS = {
  dateRange: { start: '2025-03', end: '2026-02' },
  cohorts: [] as Cohort[],
};