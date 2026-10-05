import { Info, AlertTriangle, Github, ExternalLink, Database, Code, BarChart2, Users, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Hero */}
      <div className="card p-8 md:p-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full mb-6">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-red-800">SYNTHETIC DATA — PORTFOLIO DEMO</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">AutoPay Impact Analysis</h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          A product analytics portfolio project demonstrating cohort analysis, hypothesis testing,
          and payment adoption metrics using <strong>entirely synthetic data</strong>.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <Github className="w-4 h-4 mr-2" />
            View Source
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="btn-primary">
            <ExternalLink className="w-4 h-4 mr-2" />
            Live Demo
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card border-red-200 bg-red-50">
        <div className="card-body">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-red-800">Important Disclaimer</h2>
              <p className="text-red-700 mt-2">
                <strong>This project uses 100% synthetic data generated for portfolio demonstration purposes only.</strong>
                No real SiteMinder data, customer information, property records, payment transactions, or proprietary
                business metrics are used, stored, or displayed in this application. All numbers, ratios, statistical
                results, and visualizations are computed from artificially generated datasets designed to approximate
                the analytical patterns described in the resume project description.
              </p>
              <p className="text-red-700 mt-2">
                This project is a portfolio simulation and is not connected to any real SiteMinder systems, databases,
                or analytics platforms. The methodology demonstrated here represents analytical approaches used in
                professional product analytics work, but the specific results are simulated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary-600" />
            Project Overview
          </h2>
        </div>
        <div className="card-body space-y-4">
          <p className="text-neutral-600">
            This project recreates the <strong>AutoPay Impact Analysis</strong> from my resume (SiteMinder, 2025–present)
            as an interactive portfolio dashboard. The original project analyzed 16,205 properties across three cohorts
            over a 12-month period (March 2025 – February 2026), testing five hypotheses related to payment adoption,
            pre-check-in coverage, unpaid stays, automation, and retention.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-medium text-neutral-900 mb-2">Original Resume Context</h3>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• 16,205 properties across 3 cohorts</li>
                <li>• March 2025 – February 2026 (12 months)</li>
                <li>• 5 hypotheses tested</li>
                <li>• Workbook + stakeholder deck delivered</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-medium text-neutral-900 mb-2">Key Resume Metrics</h3>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• 2.9x SM Pay usage (17.6% vs 6.1%)</li>
                <li>• 5x pre-check-in coverage</li>
                <li>• 59% vs 23% active rate</li>
                <li>• Informed AutoPay expansion strategy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary-600" />
            Methodology
          </h2>
        </div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Cohort Definition</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> <strong>Adopters:</strong> Properties with AutoPay enabled and actively processing payments</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full" /> <strong>Enabled but Inactive:</strong> Properties with AutoPay enabled but not actively using it</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-slate-500 rounded-full" /> <strong>Non-Adopters:</strong> Properties without AutoPay enabled</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Statistical Testing</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2"><Code className="w-4 h-4 text-primary-600" /> Two-sample Welch's t-test (unequal variance)</li>
                <li className="flex items-center gap-2"><Code className="w-4 h-4 text-primary-600" /> Significance level: α = 0.05</li>
                <li className="flex items-center gap-2"><Code className="w-4 h-4 text-primary-600" /> Effect size: Ratio of cohort means</li>
                <li className="flex items-center gap-2"><Code className="w-4 h-4 text-primary-600" /> Property-level aggregation for independence</li>
              </ul>
            </div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-medium text-neutral-900 mb-2">5 Hypotheses Tested</h3>
            <ol className="space-y-1 text-sm text-neutral-600 list-decimal list-inside">
              <li><strong>H1:</strong> Adopters have higher SM Pay usage rate</li>
              <li><strong>H2:</strong> Adopters achieve higher pre-check-in coverage</li>
              <li><strong>H3:</strong> Adopters have fewer unpaid stays</li>
              <li><strong>H4:</strong> Adopters require fewer manual interventions</li>
              <li><strong>H5:</strong> Adopters show better 12-month retention</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Data Generation */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-600" />
            Synthetic Data Generation
          </h2>
        </div>
        <div className="card-body space-y-4">
          <p className="text-neutral-600">
            All data is generated using Python scripts with controlled random seeds for reproducibility.
            The generation process creates realistic distributions that approximate the resume metrics
            while ensuring no real data is ever used.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary-600" />
                Properties (1,800)
              </h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Cohort distribution: 27% / 33% / 40%</li>
                <li>• 18 countries, 7 property types</li>
                <li>• Room counts: 5–300 per type</li>
                <li>• Signup dates: 2020–2024</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-600" />
                Monthly Metrics (21,600)
              </h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• 12 months × 1,800 properties</li>
                <li>• SM Pay transactions</li>
                <li>• Pre-check-in completion</li>
                <li>• Unpaid stays, active status</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-600" />
                Privacy & Safety
              </h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Raw data in .gitignore</li>
                <li>• Only aggregated JSON deployed</li>
                <li>• No PII or real identifiers</li>
                <li>• Seed-controlled reproducibility</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary-600" />
            Technology Stack
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Frontend</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• React 18 + TypeScript</li>
                <li>• Vite for build/dev</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Recharts for visualizations</li>
                <li>• React Router for navigation</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Data & Analysis</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Python (pandas, numpy, scipy)</li>
                <li>• Synthetic data generation</li>
                <li>• Statistical testing (t-tests)</li>
                <li>• Aggregation for dashboard</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Deployment</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Netlify (static hosting)</li>
                <li>• Auto-deploy from GitHub</li>
                <li>• HTTPS, CDN, custom domains</li>
                <li>• Zero backend infrastructure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Integration */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            Portfolio Integration
          </h2>
        </div>
        <div className="card-body space-y-4">
          <p className="text-neutral-600">
            This project is designed as a portfolio piece for a Senior Data / Product Analyst role.
            It demonstrates the following competencies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Analytical Skills</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Cohort analysis & segmentation</li>
                <li>• Hypothesis testing & statistical inference</li>
                <li>• KPI design & monitoring</li>
                <li>• Retention & churn analysis</li>
                <li>• Business recommendation framing</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Technical Skills</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• React + TypeScript development</li>
                <li>• Interactive dashboard design</li>
                <li>• Data visualization (Recharts)</li>
                <li>• Python data pipeline</li>
                <li>• Git/GitHub + Netlify deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary-600" />
            Links & Resources
          </h2>
        </div>
        <div className="card-body space-y-3">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <Github className="w-6 h-6 text-neutral-600" />
            <div>
              <p className="font-medium text-neutral-900">GitHub Repository</p>
              <p className="text-sm text-neutral-500">Source code, data scripts, documentation</p>
            </div>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <ExternalLink className="w-6 h-6 text-neutral-600" />
            <div>
              <p className="font-medium text-neutral-900">Live Demo (Netlify)</p>
              <p className="text-sm text-neutral-500">Interactive dashboard deployment</p>
            </div>
          </a>
          <Link to="/" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <BarChart2 className="w-6 h-6 text-neutral-600" />
            <div>
              <p className="font-medium text-neutral-900">Back to Dashboard</p>
              <p className="text-sm text-neutral-500">Explore the interactive analysis</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}