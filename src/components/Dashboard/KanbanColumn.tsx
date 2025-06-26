
import React from 'react';
import ChoreCard, { Chore } from './ChoreCard';

interface KanbanColumnProps {
  title: string;
  chores: Chore[];
  status: Chore['status'];
  onEditChore: (chore: Chore) => void;
  onStatusChange: (choreId: string, newStatus: Chore['status']) => void;
}

const KanbanColumn = ({ title, chores, status, onEditChore, onStatusChange }: KanbanColumnProps) => {
  const getColumnColor = (status: Chore['status']) => {
    switch (status) {
      case 'todo':
        return 'border-gray-300 bg-gray-50';
      case 'in-progress':
        return 'border-yellow-300 bg-yellow-50';
      case 'done':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className={`flex-1 min-w-80 rounded-lg border-2 ${getColumnColor(status)} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
          {chores.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {chores.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No chores in {title.toLowerCase()}</p>
          </div>
        ) : (
          chores.map((chore) => (
            <ChoreCard
              key={chore.id}
              chore={chore}
              onEdit={onEditChore}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
