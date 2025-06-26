
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateSectionProps {
  dueDate?: Date;
  recurring: 'daily' | 'weekly' | 'monthly' | 'none';
  onDueDateChange: (date?: Date) => void;
  onRecurringChange: (recurring: 'daily' | 'weekly' | 'monthly' | 'none') => void;
}

const DateSection = ({ dueDate, recurring, onDueDateChange, onRecurringChange }: DateSectionProps) => {
  return (
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
              onSelect={onDueDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recurring" className="text-sm font-medium text-gray-700">Repeat Interval</Label>
        <Select value={recurring} onValueChange={onRecurringChange}>
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
  );
};

export default DateSection;
