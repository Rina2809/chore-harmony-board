
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Chore } from './ChoreCard';
import CategorySection from './CategorySection';
import HatePointsSection from './HatePointsSection';
import DateSection from './DateSection';

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
    setFormData(prev => ({ ...prev, category }));
  };

  const handleIconChange = (icon: string) => {
    setFormData(prev => ({ ...prev, icon }));
  };

  const handleHatePointsChange = (hatePoints: number) => {
    setFormData(prev => ({ ...prev, hatePoints }));
  };

  const handleRecurringChange = (recurring: 'daily' | 'weekly' | 'monthly' | 'none') => {
    setFormData(prev => ({ ...prev, recurring }));
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
          {/* Title - full width */}
          <div className="space-y-2">
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

          {/* Category and Icon Section */}
          <CategorySection
            category={formData.category || 'Cleaning'}
            icon={formData.icon || '🧹'}
            onCategoryChange={handleCategoryChange}
            onIconChange={handleIconChange}
          />

          {/* Hate Points Section */}
          <HatePointsSection
            hatePoints={formData.hatePoints || 1}
            onHatePointsChange={handleHatePointsChange}
          />

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

          {/* Date and Recurring Section */}
          <DateSection
            dueDate={dueDate}
            recurring={formData.recurring || 'none'}
            onDueDateChange={setDueDate}
            onRecurringChange={handleRecurringChange}
          />

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
