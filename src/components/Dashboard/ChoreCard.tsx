
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

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
    'Cleaning': 'bg-blue-100 text-blue-800',
    'Cooking': 'bg-orange-100 text-orange-800',
    'Shopping': 'bg-purple-100 text-purple-800',
    'Maintenance': 'bg-gray-100 text-gray-800',
    'Outdoor': 'bg-green-100 text-green-800',
    'Pet Care': 'bg-yellow-100 text-yellow-800',
  };

  const priorityColors = {
    'low': 'border-l-green-400',
    'medium': 'border-l-yellow-400',
    'high': 'border-l-red-400',
  };

  const isOverdue = chore.dueDate && new Date(chore.dueDate) < new Date();

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 ${priorityColors[chore.priority]} p-4 cursor-pointer hover:shadow-md transition-all duration-200 group`}
      onClick={() => onEdit(chore)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
            {chore.icon}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate group-hover:text-green-700 transition-colors">
            {chore.title}
          </h4>
          
          {chore.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {chore.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <Badge 
                variant="secondary" 
                className={categoryColors[chore.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}
              >
                {chore.category}
              </Badge>
              
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

            {chore.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {chore.assignees.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee.id} className="w-6 h-6 border-2 border-white">
                    <AvatarImage src={assignee.avatar} />
                    <AvatarFallback className="text-xs bg-green-100 text-green-800">
                      {assignee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {chore.assignees.length > 3 && (
                  <div className="w-6 h-6 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center text-xs text-gray-600">
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
