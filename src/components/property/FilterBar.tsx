"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (filter: 'buy' | 'rent' | 'favorites') => void;
  currentFilter: 'buy' | 'rent' | 'favorites';
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

const FilterBar: FC<FilterBarProps> = ({ onFilterChange, currentFilter, searchTerm, onSearchTermChange }) => {
  const filters: Array<'buy' | 'rent' | 'favorites'> = ['buy', 'rent', 'favorites'];

  return (
    <div className="bg-card p-4 shadow-lg rounded-xl mx-auto max-w-4xl mb-12 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 border">
      <div className="flex bg-muted p-1 rounded-full">
        {filters.map(filter => (
          <Button
            key={filter}
            variant={currentFilter === filter ? 'default' : 'ghost'}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 sm:px-5 sm:py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 capitalize ${
              currentFilter === filter
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {filter}
          </Button>
        ))}
      </div>
      <div className="relative w-full sm:w-auto flex-grow sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, locality..."
          className="w-full p-3 border-input rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 text-base pl-10"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          aria-label="Search properties"
        />
      </div>
    </div>
  );
};

export default FilterBar;
