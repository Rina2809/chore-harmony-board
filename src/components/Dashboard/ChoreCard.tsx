
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, Clock, MoreVertical } from 'lucide-react';

export interface Chore {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  category: string;
  icon: string;
  assignees: Array<{ id: string; name: string; avatar?: string }>;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  recurring?: 'daily' | 'weekly' | 'monthly' | 'none';
}

interface ChoreCardProps {
  chore: Chore;
  onEdit: (chore: Chore) => void;
  onStatusChange: (choreId: string, newStatus: Chore['status']) => void;
}

const ChoreCard = ({ chore, onEdit, onStatusChange }: ChoreCardProps) => {
  const categoryColors = {
    'Cleaning': 'bg-blue-100 text-blue-700',
    'Cooking': 'bg-orange-100 text-orange-700',
    'Shopping': 'bg-purple-100 text-purple-700',
    'Maintenance': 'bg-gray-100 text-gray-700',
    'Outdoor': 'bg-green-100 text-green-700',
    'Pet Care': 'bg-yellow-100 text-yellow-700',
  };

  const statusLabels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done'
  };

  const isOverdue = chore.dueDate && new Date(chore.dueDate) < new Date();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group">
      <div className="flex items-start space-x-3">
        {/* Icon circle - 32x32px as per Figma */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center text-lg">
            {chore.icon}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Title - 16px semibold as per Figma */}
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-[#22C55E] transition-colors">
              {chore.title}
            </h4>
            
            {/* Status dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200">
                <DropdownMenuItem onClick={() => onStatusChange(chore.id, 'todo')}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(chore.id, 'in-progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(chore.id, 'done')}>
                  Done
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(chore)}>
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Category tag pill below title */}
          <div className="mt-2">
            <Badge 
              variant="secondary" 
              className={`${categoryColors[chore.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-700'} rounded-full px-2.5 py-1 text-xs font-medium`}
            >
              {chore.category}
            </Badge>
          </div>

          {/* Due date and recurring info */}
          <div className="flex items-center space-x-3 mt-3">
            {chore.dueDate && (
              <div className={`flex items-center space-x-1 text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                <Calendar className="w-3 h-3" />
                <span>
                  {chore.dueDate.toLocaleDateString()}
                </span>
              </div>
            )}
            
            {chore.recurring && chore.recurring !== 'none' && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{chore.recurring}</span>
              </div>
            )}
          </div>

          {/* Bottom row: overlapping assignee avatars with count badge */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500 font-medium">
              {statusLabels[chore.status]}
            </div>
            
            {chore.assignees.length > 0 && (
              <div className="flex items-center -space-x-2">
                {chore.assignees.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee.id} className="w-6 h-6 border-2 border-white ring-1 ring-gray-200">
                    <AvatarImage src={assignee.avatar} />
                    <AvatarFallback className="text-xs bg-[#F3F4F6] text-gray-700 font-medium">
                      {assignee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {chore.assignees.length > 3 && (
                  <div className="w-6 h-6 bg-[#F3F4F6] border-2 border-white ring-1 ring-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600 font-medium">
                    +{chore.assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoreCard;
