
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategorySectionProps {
  category: string;
  icon: string;
  onCategoryChange: (category: string) => void;
  onIconChange: (icon: string) => void;
}

const CategorySection = ({ category, icon, onCategoryChange, onIconChange }: CategorySectionProps) => {
  const categories = [
    { name: 'Cleaning', icon: '🧹' },
    { name: 'Cooking', icon: '🍳' },
    { name: 'Shopping', icon: '🛒' },
    { name: 'Maintenance', icon: '🔧' },
    { name: 'Outdoor', icon: '🌱' },
    { name: 'Pet Care', icon: '🐕' },
  ];

  const iconOptions = ['🧹', '🍳', '🛒', '🔧', '🌱', '🐕', '🗑️', '🚗', '💡', '📱', '👕', '🏠'];

  const handleCategoryChange = (selectedCategory: string) => {
    const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);
    onCategoryChange(selectedCategory);
    if (selectedCategoryData) {
      onIconChange(selectedCategoryData.icon);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="border-gray-200 focus:border-[#22C55E]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {categories.map((categoryItem) => (
              <SelectItem key={categoryItem.name} value={categoryItem.name}>
                <div className="flex items-center space-x-2">
                  <span>{categoryItem.icon}</span>
                  <span>{categoryItem.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Icon picker */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Icon</Label>
        <div className="grid grid-cols-6 gap-2 p-3 border border-gray-200 rounded-lg">
          {iconOptions.map((iconOption) => (
            <button
              key={iconOption}
              type="button"
              onClick={() => onIconChange(iconOption)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-gray-100 transition-colors ${
                icon === iconOption ? 'bg-[#22C55E] bg-opacity-10 ring-2 ring-[#22C55E]' : ''
              }`}
            >
              {iconOption}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
