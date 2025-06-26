
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
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
    status: 'todo',
    recurring: 'none',
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
        status: 'todo',
        recurring: 'none',
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Chore' : 'Add New Chore'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter chore title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter chore description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(priority: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurring">Repeat</Label>
            <Select value={formData.recurring} onValueChange={(recurring: 'daily' | 'weekly' | 'monthly' | 'none') => setFormData(prev => ({ ...prev, recurring }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select repeat interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {isEditing ? 'Update' : 'Create'} Chore
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChoreModal;
