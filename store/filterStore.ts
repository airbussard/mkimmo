import { create } from 'zustand'
import { PropertyFilters } from '@/types/property'

interface FilterState {
  filters: PropertyFilters
  searchQuery: string
}

interface FilterActions {
  setFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void
  setFilters: (filters: Partial<PropertyFilters>) => void
  clearFilters: () => void
  setSearchQuery: (query: string) => void
}

type FilterStore = FilterState & FilterActions

const initialState: FilterState = {
  filters: {},
  searchQuery: '',
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  clearFilters: () => set({ filters: {}, searchQuery: '' }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
