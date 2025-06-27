
import React from 'react';
import ChoreColumn from './ChoreColumn';
import { Chore } from './ChoreCard';

interface ChoreBoardProps {
  chores: Chore[];
  onEdit: (chore: Chore) => void;
  onToggleComplete: (choreId: string) => void;
}

const ChoreBoard = ({ chores, onEdit, onToggleComplete }: ChoreBoardProps) => {
  const openChores = chores.filter(chore => !chore.isCompleted);
  const recentlyDoneChores = chores.filter(chore => chore.isCompleted);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChoreColumn
        title="Open Chores"
        chores={openChores}
        onEdit={onEdit}
        onToggleComplete={onToggleComplete}
        isCompletedColumn={false}
      />
      <ChoreColumn
        title="Recently Done"
        chores={recentlyDoneChores}
        onEdit={onEdit}
        onToggleComplete={onToggleComplete}
        isCompletedColumn={true}
      />
    </div>
  );
};

export default ChoreBoard;
