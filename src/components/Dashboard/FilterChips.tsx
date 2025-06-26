
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { X, ChevronDown } from 'lucide-react';

interface FilterChipsProps {
  activeFilters: string[];
  onRemoveFilter: (filter: string) => void;
  onAddFilter: (filter: string) => void;
}

const FilterChips = ({ activeFilters, onRemoveFilter, onAddFilter }: FilterChipsProps) => {
  const availableFilters = ['Cleaning', 'Cooking', 'Shopping', 'Maintenance', 'Outdoor', 'Pet Care'];
  const unusedFilters = availableFilters.filter(filter => !activeFilters.includes(filter));

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center space-x-3">
        {/* Active filter chips */}
        {activeFilters.map((filter) => (
          <div
            key={filter}
            className="inline-flex items-center space-x-2 bg-[#F3F4F6] text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium animate-fade-in"
          >
            <span>{filter}</span>
            <button
              onClick={() => onRemoveFilter(filter)}
              className="hover:bg-gray-300 rounded-full p-0.5 transition-colors duration-150"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Add filter dropdown */}
        {unusedFilters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                <span>Filter</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white shadow-lg border border-gray-200">
              {unusedFilters.map((filter) => (
                <DropdownMenuItem 
                  key={filter} 
                  onClick={() => onAddFilter(filter)}
                  className="hover:bg-gray-50"
                >
                  {filter}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default FilterChips;
