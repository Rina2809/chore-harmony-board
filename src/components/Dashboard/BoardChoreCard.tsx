
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Calendar, Clock } from 'lucide-react';
import { Chore } from './ChoreCard';

interface BoardChoreCardProps {
  chore: Chore;
  onEdit: (chore: Chore) => void;
  onToggleComplete: (choreId: string) => void;
  isInCompletedColumn: boolean;
}

const BoardChoreCard = ({ chore, onEdit, onToggleComplete, isInCompletedColumn }: BoardChoreCardProps) => {
  const categoryColors = {
    'Cleaning': 'bg-blue-500',
    'Cooking': 'bg-orange-500',
    'Shopping': 'bg-purple-500',
    'Maintenance': 'bg-gray-500',
    'Outdoor': 'bg-green-500',
    'Pet Care': 'bg-yellow-500',
  };

  const cardBgColor = isInCompletedColumn ? 'bg-green-100' : 'bg-white';
  const categoryColor = categoryColors[chore.category as keyof typeof categoryColors] || 'bg-gray-500';
  const isOverdue = chore.dueDate && new Date(chore.dueDate) < new Date() && !chore.isCompleted;

  return (
    <div className={`${cardBgColor} rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative`}>
      {/* Category color stripe on the left */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${categoryColor} rounded-l-lg`}></div>
      
      <div className="ml-2">
        <div className="flex items-start justify-between mb-3">
          {/* Chore icon and title */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl flex-shrink-0">
              {chore.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-gray-900 ${isInCompletedColumn ? 'line-through text-green-700' : ''}`}>
                {chore.title}
              </h3>
              {chore.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {chore.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200">
              <DropdownMenuItem onClick={() => onToggleComplete(chore.id)}>
                {chore.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(chore)}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Due date and recurring info */}
        {(chore.dueDate || (chore.recurring && chore.recurring !== 'none')) && (
          <div className="flex items-center space-x-3 mb-3">
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
        )}

        {/* Bottom row: hate points and assignee */}
        <div className="flex items-center justify-between">
          {/* Hate points in red */}
          <div className="flex-shrink-0">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {chore.hatePoints}
            </span>
          </div>
          
          {/* Assignee avatar */}
          {chore.assignees.length > 0 && (
            <div className="flex-shrink-0">
              <Avatar className="w-8 h-8">
                <AvatarImage src={chore.assignees[0].avatar} />
                <AvatarFallback className="text-xs bg-gray-200 text-gray-700 font-medium">
                  {chore.assignees[0].name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardChoreCard;
