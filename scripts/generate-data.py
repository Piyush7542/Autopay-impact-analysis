#!/usr/bin/env python3
"""
Generate synthetic data for AutoPay Impact Analysis portfolio project.

This script creates:
1. properties.csv - 1,800 synthetic properties across 3 cohorts
2. monthly_metrics.csv - 12 months of metrics per property (Mar 2025 - Feb 2026)

Data is designed to match resume metrics approximately:
- Adopters: 17.6% SM Pay usage, 5x pre-check-in coverage, 59% active rate
- Enabled_Inactive: 6.1% SM Pay usage, baseline pre-check-in, 23% active rate
- Non_Adopter: ~3% SM Pay usage, low pre-check-in, ~15% active rate

Run: python scripts/generate-data.py
Output: data/raw/properties.csv, data/raw/monthly_metrics.csv
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import json

# Set seed for reproducibility
np.random.seed(42)

# Configuration
N_PROPERTIES = 1800
MONTHS = ['2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08',
          '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02']

COHORT_DISTRIBUTION = {
    'Adopter': 0.25,      # 450 properties
    'Enabled_Inactive': 0.35,  # 630 properties
    'Non_Adopter': 0.40,  # 720 properties
}

COUNTRIES = [
    'Australia', 'New Zealand', 'United Kingdom', 'Ireland',
    'Singapore', 'Malaysia', 'Thailand', 'Indonesia',
    'United States', 'Canada', 'Mexico',
    'Germany', 'France', 'Spain', 'Italy',
    'South Africa', 'UAE', 'Japan',
]

COUNTRY_WEIGHTS = [0.15, 0.05, 0.10, 0.03, 0.08, 0.05, 0.04, 0.03,
                   0.12, 0.05, 0.03, 0.06, 0.05, 0.04, 0.03,
                   0.03, 0.02, 0.02]

# Normalize weights to sum to 1
COUNTRY_WEIGHTS = np.array(COUNTRY_WEIGHTS) / np.sum(COUNTRY_WEIGHTS)

PROPERTY_TYPES = ['Hotel', 'Resort', 'Motel', 'Hostel', 'Apartment', 'Boutique', 'Bed & Breakfast']
TYPE_WEIGHTS = [0.40, 0.15, 0.10, 0.05, 0.10, 0.12, 0.08]

ROOM_RANGES = {
    'Hotel': (50, 300),
    'Resort': (30, 200),
    'Motel': (15, 80),
    'Hostel': (20, 100),
    'Apartment': (10, 50),
    'Boutique': (10, 40),
    'Bed & Breakfast': (5, 20),
}

# Cohort-specific parameters (designed to match resume metrics)
COHORT_PARAMS = {
    'Adopter': {
        'sm_pay_base_rate': 0.176,      # 17.6% SM Pay usage
        'pre_checkin_base_rate': 0.75,   # High pre-check-in coverage
        'active_base_rate': 0.59,        # 59% active rate
        'unpaid_stay_base_rate': 0.03,   # Low unpaid stays
        'intervention_base_rate': 0.05,  # Low manual interventions
        'retention_base_rate': 0.75,     # High 12-month retention
    },
    'Enabled_Inactive': {
        'sm_pay_base_rate': 0.061,       # 6.1% SM Pay usage
        'pre_checkin_base_rate': 0.15,   # Low pre-check-in (1/5 of adopter)
        'active_base_rate': 0.23,        # 23% active rate
        'unpaid_stay_base_rate': 0.12,   # Higher unpaid stays
        'intervention_base_rate': 0.25,  # More manual interventions
        'retention_base_rate': 0.45,     # Lower retention
    },
    'Non_Adopter': {
        'sm_pay_base_rate': 0.03,        # ~3% SM Pay usage
        'pre_checkin_base_rate': 0.08,   # Very low pre-check-in
        'active_base_rate': 0.15,        # ~15% active rate
        'unpaid_stay_base_rate': 0.18,   # Highest unpaid stays
        'intervention_base_rate': 0.35,  # Most manual interventions
        'retention_base_rate': 0.35,     # Lowest retention
    },
}

def generate_properties(n: int) -> pd.DataFrame:
    """Generate synthetic property data."""
    
    # Assign cohorts based on distribution
    cohorts = np.random.choice(
        list(COHORT_DISTRIBUTION.keys()),
        size=n,
        p=list(COHORT_DISTRIBUTION.values())
    )
    
    properties = []
    for i, cohort in enumerate(cohorts):
        prop_id = f'PROP_{i+1:04d}'
        country = np.random.choice(COUNTRIES, p=COUNTRY_WEIGHTS)
        prop_type = np.random.choice(PROPERTY_TYPES, p=TYPE_WEIGHTS)
        min_rooms, max_rooms = ROOM_RANGES[prop_type]
        total_rooms = np.random.randint(min_rooms, max_rooms + 1)
        
        # Signup date: between 2020-01 and 2024-12
        signup_start = datetime(2020, 1, 1)
        signup_end = datetime(2024, 12, 31)
        signup_date = signup_start + timedelta(
            days=np.random.randint(0, (signup_end - signup_start).days)
        )
        
        # Autopay enabled date (for Adopter and Enabled_Inactive)
        autopay_enabled_date = None
        if cohort in ['Adopter', 'Enabled_Inactive']:
            # Enabled between 2024-01 and 2025-02
            enabled_start = datetime(2024, 1, 1)
            enabled_end = datetime(2025, 2, 28)
            autopay_enabled_date = enabled_start + timedelta(
                days=np.random.randint(0, (enabled_end - enabled_start).days)
            )
        
        # Property name
        name_prefixes = ['Grand', 'Royal', 'Coastal', 'Urban', 'Harbor', 'Mountain', 'Valley', 'Sunset', 'Riverside', 'Park']
        name_suffixes = ['Hotel', 'Resort', 'Inn', 'Suites', 'Lodge', 'Retreat', 'Plaza', 'Tower', 'Manor', 'Court']
        property_name = f"{np.random.choice(name_prefixes)} {np.random.choice(name_suffixes)} {i+1}"
        
        # Region based on country
        region_map = {
            'Australia': ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'],
            'New Zealand': ['Auckland', 'Wellington', 'Canterbury', 'Waikato', 'Otago'],
            'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
            'Ireland': ['Leinster', 'Munster', 'Connacht', 'Ulster'],
            'Singapore': ['Central', 'North', 'East', 'West', 'North-East'],
            'Malaysia': ['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Sabah', 'Sarawak'],
            'Thailand': ['Bangkok', 'Central', 'North', 'Northeast', 'South'],
            'Indonesia': ['Jakarta', 'West Java', 'East Java', 'Bali', 'Sumatra'],
            'United States': ['California', 'New York', 'Texas', 'Florida', 'Illinois'],
            'Canada': ['Ontario', 'British Columbia', 'Quebec', 'Alberta'],
            'Mexico': ['Mexico City', 'Jalisco', 'Nuevo Leon', 'Quintana Roo'],
            'Germany': ['Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Berlin'],
            'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes'],
            'Spain': ['Madrid', 'Catalonia', 'Andalusia', 'Valencia'],
            'Italy': ['Lombardy', 'Lazio', 'Campania', 'Sicily', 'Tuscany'],
            'South Africa': ['Gauteng', 'Western Cape', 'KwaZulu-Natal'],
            'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
            'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Fukuoka'],
        }
        region = np.random.choice(region_map.get(country, ['Unknown']))
        
        properties.append({
            'property_id': prop_id,
            'property_name': property_name,
            'country': country,
            'region': region,
            'property_type': prop_type,
            'total_rooms': total_rooms,
            'signup_date': signup_date.strftime('%Y-%m-%d'),
            'cohort': cohort,
            'autopay_enabled_date': autopay_enabled_date.strftime('%Y-%m-%d') if autopay_enabled_date else '',
        })
    
    return pd.DataFrame(properties)


def generate_monthly_metrics(properties_df: pd.DataFrame) -> pd.DataFrame:
    """Generate 12 months of metrics for each property."""
    
    all_metrics = []
    
    for _, prop in properties_df.iterrows():
        cohort = prop['cohort']
        params = COHORT_PARAMS[cohort]
        total_rooms = prop['total_rooms']
        
        # Property-level random effects (some properties perform better/worse)
        prop_effect = np.random.lognormal(0, 0.2)  # multiplicative effect
        
        # Determine if property is "active" for each month (based on retention)
        # Adopters more likely to stay active throughout
        base_active_prob = params['active_base_rate']
        
        for month_idx, month in enumerate(MONTHS):
            # Seasonal effects
            seasonal_factor = 1.0
            month_num = int(month.split('-')[1])
            if month_num in [12, 1, 2]:  # Summer in Southern Hemisphere / Winter in North
                seasonal_factor = 1.15
            elif month_num in [6, 7, 8]:  # Winter in South / Summer in North
                seasonal_factor = 0.95
            
            # Monthly variation
            monthly_noise = np.random.lognormal(0, 0.1)
            
            # Total transactions scales with rooms and seasonality
            base_transactions = total_rooms * 0.8 * seasonal_factor * monthly_noise * prop_effect
            total_transactions = max(1, int(np.random.poisson(base_transactions)))
            
            # SM Pay transactions
            sm_pay_prob = params['sm_pay_base_rate'] * prop_effect * np.random.lognormal(0, 0.15)
            sm_pay_transactions = np.random.binomial(total_transactions, min(0.95, sm_pay_prob))
            
            # Pre-check-in
            pre_checkin_eligible = max(1, int(total_transactions * 0.9))  # 90% of stays eligible
            pre_checkin_prob = params['pre_checkin_base_rate'] * prop_effect * np.random.lognormal(0, 0.2)
            pre_checkins_completed = np.random.binomial(pre_checkin_eligible, min(0.95, pre_checkin_prob))
            
            # Unpaid stays
            unpaid_stay_prob = params['unpaid_stay_base_rate'] / prop_effect * np.random.lognormal(0, 0.25)
            unpaid_stays = np.random.binomial(total_transactions, min(0.5, unpaid_stay_prob))
            
            # Manual interventions
            intervention_prob = params['intervention_base_rate'] / prop_effect * np.random.lognormal(0, 0.2)
            manual_interventions = np.random.binomial(total_transactions, min(0.5, intervention_prob))
            
            # Active status - decays over time for non-adopters
            if cohort == 'Adopter':
                active_prob = base_active_prob * (1.0 - 0.02 * month_idx)  # slight decay
            elif cohort == 'Enabled_Inactive':
                active_prob = base_active_prob * (1.0 - 0.05 * month_idx)  # faster decay
            else:
                active_prob = base_active_prob * (1.0 - 0.08 * month_idx)  # fastest decay
            
            is_active = np.random.random() < max(0.05, active_prob)
            
            all_metrics.append({
                'property_id': prop['property_id'],
                'month': month,
                'sm_pay_transactions': sm_pay_transactions,
                'total_transactions': total_transactions,
                'pre_checkins_completed': pre_checkins_completed,
                'pre_checkins_eligible': pre_checkin_eligible,
                'unpaid_stays': unpaid_stays,
                'total_stays': total_transactions,  # 1 transaction ≈ 1 stay for simplicity
                'is_active': is_active,
                'manual_interventions': manual_interventions,
            })
    
    return pd.DataFrame(all_metrics)


def main():
    print("Generating synthetic AutoPay Impact Analysis data...")
    
    # Create output directory
    os.makedirs('data/raw', exist_ok=True)
    
    # Generate properties
    print(f"Generating {N_PROPERTIES} properties...")
    properties_df = generate_properties(N_PROPERTIES)
    properties_df.to_csv('data/raw/properties.csv', index=False)
    print(f"  Saved: data/raw/properties.csv ({len(properties_df)} rows)")
    
    # Print cohort distribution
    cohort_counts = properties_df['cohort'].value_counts()
    print("\nCohort Distribution:")
    for cohort, count in cohort_counts.items():
        print(f"  {cohort}: {count} ({count/len(properties_df)*100:.1f}%)")
    
    # Generate monthly metrics
    print(f"\nGenerating monthly metrics for {len(MONTHS)} months...")
    metrics_df = generate_monthly_metrics(properties_df)
    metrics_df.to_csv('data/raw/monthly_metrics.csv', index=False)
    print(f"  Saved: data/raw/monthly_metrics.csv ({len(metrics_df)} rows)")
    
    # Save metadata
    metadata = {
        'generated_at': datetime.now().isoformat(),
        'n_properties': N_PROPERTIES,
        'months': MONTHS,
        'cohort_distribution': COHORT_DISTRIBUTION,
        'cohort_params': COHORT_PARAMS,
        'note': 'SYNTHETIC DATA - Portfolio demo only. Not real SiteMinder data.'
    }
    with open('data/raw/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    print("  Saved: data/raw/metadata.json")
    
    print("\nData generation complete!")
    print("Next step: Run 'python scripts/aggregate-data.py' to create aggregated data for the dashboard.")


if __name__ == '__main__':
    main()