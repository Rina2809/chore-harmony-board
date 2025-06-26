
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarIcon, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Chore } from './ChoreCard';

interface ChoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (chore: Partial<Chore>) => void;
  chore?: Chore;
  isEditing?: boolean;
}

const ChoreModal = ({ isOpen, onClose, onSave, chore, isEditing = false }: ChoreModalProps) => {
  const [formData, setFormData] = useState<Partial<Chore>>({
    title: '',
    description: '',
    category: 'Cleaning',
    icon: '🧹',
    priority: 'medium',
    recurring: 'none',
    hatePoints: 1,
    assignees: []
  });

  const [dueDate, setDueDate] = useState<Date>();

  useEffect(() => {
    if (chore && isEditing) {
      setFormData(chore);
      setDueDate(chore.dueDate);
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Cleaning',
        icon: '🧹',
        priority: 'medium',
        recurring: 'none',
        hatePoints: 1,
        assignees: []
      });
      setDueDate(undefined);
    }
  }, [chore, isEditing, isOpen]);

  const categories = [
    { name: 'Cleaning', icon: '🧹' },
    { name: 'Cooking', icon: '🍳' },
    { name: 'Shopping', icon: '🛒' },
    { name: 'Maintenance', icon: '🔧' },
    { name: 'Outdoor', icon: '🌱' },
    { name: 'Pet Care', icon: '🐕' },
  ];

  const iconOptions = ['🧹', '🍳', '🛒', '🔧', '🌱', '🐕', '🗑️', '🚗', '💡', '📱', '👕', '🏠'];

  const hatePointsOptions = [
    { value: 1, label: 'Mildly Annoying', description: 'Not too bad' },
    { value: 2, label: 'I have done worse', description: 'Manageable' },
    { value: 3, label: 'This is worse', description: 'Getting annoying' },
    { value: 4, label: 'Hate it', description: 'Really don\'t want to do this' },
    { value: 5, label: 'Really hate it', description: 'Strongly dislike' },
    { value: 6, label: 'Absolutely despise', description: 'Almost unbearable' },
    { value: 7, label: 'Pure agony', description: 'The worst possible task' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const choreData = {
      ...formData,
      dueDate,
      id: isEditing ? chore?.id : Date.now().toString(),
    };

    onSave(choreData);
    onClose();
  };

  const handleCategoryChange = (category: string) => {
    const selectedCategory = categories.find(cat => cat.name === category);
    setFormData(prev => ({
      ...prev,
      category,
      icon: selectedCategory?.icon || '🧹'
    }));
  };

  const getHatePointsColor = (points: number) => {
    if (points <= 2) return 'text-green-600 border-green-200';
    if (points <= 4) return 'text-yellow-600 border-yellow-200';
    return 'text-red-600 border-red-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Chore' : 'Add New Chore'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* 2-column grid on desktop, single column on mobile as per Figma */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title - full width */}
            <div className="lg:col-span-2 space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter chore title"
                className="border-gray-200 focus:border-[#22C55E] focus:ring-[#22C55E]"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="border-gray-200 focus:border-[#22C55E]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
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
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-gray-100 transition-colors ${
                      formData.icon === icon ? 'bg-[#22C55E] bg-opacity-10 ring-2 ring-[#22C55E]' : ''
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hate Points - full width */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Hate Level (1-7)</Label>
            <RadioGroup 
              value={formData.hatePoints?.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, hatePoints: parseInt(value) }))}
              className="grid grid-cols-1 gap-3"
            >
              {hatePointsOptions.map((option) => (
                <div key={option.value} className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                  formData.hatePoints === option.value ? getHatePointsColor(option.value) : 'border-gray-200'
                }`}>
                  <RadioGroupItem value={option.value.toString()} id={`hate-${option.value}`} />
                  <div className="flex items-center space-x-2 flex-1">
                    <Heart className={`w-4 h-4 ${getHatePointsColor(option.value).split(' ')[0]}`} fill="currentColor" />
                    <div className="flex-1">
                      <Label htmlFor={`hate-${option.value}`} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{option.value}/7</span>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Description - full width */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter chore description (optional)"
              rows={3}
              className="border-gray-200 focus:border-[#22C55E] focus:ring-[#22C55E]"
            />
          </div>

          {/* Date and Interval */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-200 hover:bg-gray-50",
                      !dueDate && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-gray-200">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurring" className="text-sm font-medium text-gray-700">Repeat Interval</Label>
              <Select value={formData.recurring} onValueChange={(recurring: 'daily' | 'weekly' | 'monthly' | 'none') => setFormData(prev => ({ ...prev, recurring }))}>
                <SelectTrigger className="border-gray-200 focus:border-[#22C55E]">
                  <SelectValue placeholder="Select repeat interval" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="none">No repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</Label>
            <Select value={formData.priority} onValueChange={(priority: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority }))}>
              <SelectTrigger className="border-gray-200 focus:border-[#22C55E]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6 py-2 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 py-2 shadow-sm"
            >
              {isEditing ? 'Update' : 'Create'} Chore
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChoreModal;
