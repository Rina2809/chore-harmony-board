
import React from 'react';
import BoardChoreCard from './BoardChoreCard';
import { Chore } from './ChoreCard';

interface ChoreColumnProps {
  title: string;
  chores: Chore[];
  onEdit: (chore: Chore) => void;
  onToggleComplete: (choreId: string) => void;
  isCompletedColumn: boolean;
}

const ChoreColumn = ({ title, chores, onEdit, onToggleComplete, isCompletedColumn }: ChoreColumnProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-3">
        {chores.map((chore) => (
          <BoardChoreCard
            key={chore.id}
            chore={chore}
            onEdit={onEdit}
            onToggleComplete={onToggleComplete}
            isInCompletedColumn={isCompletedColumn}
          />
        ))}
        {chores.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {isCompletedColumn ? 'No completed chores yet' : 'No open chores'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChoreColumn;
