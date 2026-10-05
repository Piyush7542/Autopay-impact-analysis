import { createContext, useContext, useState, ReactNode } from 'react';
import type { FilterState } from '../types';
import { DEFAULT_FILTERS } from '../utils/constants';

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const hasActiveFilters = 
    filters.countries.length > 0 ||
    filters.propertyTypes.length > 0 ||
    filters.cohorts.length > 0 ||
    filters.dateRange.start !== DEFAULT_FILTERS.dateRange.start ||
    filters.dateRange.end !== DEFAULT_FILTERS.dateRange.end ||
    filters.roomRange.min !== DEFAULT_FILTERS.roomRange.min ||
    filters.roomRange.max !== DEFAULT_FILTERS.roomRange.max;

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters, hasActiveFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}