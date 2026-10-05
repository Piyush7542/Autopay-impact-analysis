# Data Generation Scripts

These scripts create synthetic data for the AutoPay Impact Analysis dashboard.

## Prerequisites

```bash
# Install Python dependencies
pip install pandas numpy scipy
```

## Usage

### 1. Generate Raw Synthetic Data
```bash
python scripts/generate-data.py
```
Creates:
- `data/raw/properties.csv` - 1,800 synthetic properties
- `data/raw/monthly_metrics.csv` - 12 months of metrics per property
- `data/raw/metadata.json` - Generation metadata

### 2. Aggregate for Dashboard
```bash
python scripts/aggregate-data.py
```
Creates (in `public/data/`):
- `cohort-summary.json` - KPIs per cohort
- `monthly-trends.json` - Time series per cohort
- `hypothesis-results.json` - 5 hypothesis test results
- `sample-properties.json` - 20 sample properties for detail views

### 3. Run Both (via npm)
```bash
npm run generate-data
npm run aggregate-data
```

## Data Privacy

- **Raw data** (`data/raw/`) is **gitignored** - never committed to GitHub
- **Aggregated data** (`public/data/`) is **committed** - safe for browser consumption
- All data is **synthetic** - no real SiteMinder data used

## Regenerating Data

To regenerate with different random seed:
1. Edit `scripts/generate-data.py` and change `np.random.seed(42)`
2. Run both scripts again
3. Commit updated `public/data/` files