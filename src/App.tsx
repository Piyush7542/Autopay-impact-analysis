import { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { SyntheticDataBadge } from './components/ui/SyntheticDataBadge';
import { ExecutiveSummary } from './pages/ExecutiveSummary';
import { CohortAnalysis } from './pages/CohortAnalysis';
import { PaymentUsage } from './pages/PaymentUsage';
import { PreCheckinCoverage } from './pages/PreCheckinCoverage';
import { ActiveRate } from './pages/ActiveRate';
import { UnpaidStays } from './pages/UnpaidStays';
import { RetentionAnalysis } from './pages/RetentionAnalysis';
import { HypothesisTesting } from './pages/HypothesisTesting';
import { About } from './pages/About';
import { FilterProvider, useFilters } from './hooks/useFilters';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      
      <Footer />
      <SyntheticDataBadge />
    </div>
  );
}

function App() {
  return (
    <FilterProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ExecutiveSummary />} />
          <Route path="cohorts" element={<CohortAnalysis />} />
          <Route path="payments" element={<PaymentUsage />} />
          <Route path="precheckin" element={<PreCheckinCoverage />} />
          <Route path="active" element={<ActiveRate />} />
          <Route path="unpaid" element={<UnpaidStays />} />
          <Route path="retention" element={<RetentionAnalysis />} />
          <Route path="hypotheses" element={<HypothesisTesting />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </FilterProvider>
  );
}

export default App;