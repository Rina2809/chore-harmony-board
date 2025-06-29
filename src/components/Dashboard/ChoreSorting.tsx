
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'category' | 'priority' | 'due_date' | 'created_at';
export type SortDirection = 'asc' | 'desc';

interface ChoreSortingProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (sortBy: SortOption, direction: SortDirection) => void;
}

const ChoreSorting = ({ sortBy, sortDirection, onSortChange }: ChoreSortingProps) => {
  const sortOptions = [
    { value: 'category' as SortOption, label: 'Category' },
    { value: 'priority' as SortOption, label: 'Priority' },
    { value: 'due_date' as SortOption, label: 'Due Date' },
    { value: 'created_at' as SortOption, label: 'Date Created' },
  ];

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return `${option?.label} (${sortDirection === 'asc' ? 'A-Z' : 'Z-A'})`;
  };

  const handleSortSelect = (newSortBy: SortOption) => {
    if (newSortBy === sortBy) {
      // Toggle direction if same sort option
      onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New sort option, default to ascending
      onSortChange(newSortBy, 'asc');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4" />
            <span>{getSortLabel()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              className={sortBy === option.value ? 'bg-green-50 text-green-700' : ''}
            >
              {option.label}
              {sortBy === option.value && (
                <span className="ml-auto text-xs">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChoreSorting;
