
import React, { useState } from 'react';
import Header from './Header';
import ChoreCard from './ChoreCard';
import ChoreModal from './ChoreModal';
import FilterChips from './FilterChips';
import { Chore } from './ChoreCard';

interface DashboardProps {
  user: { id: string; name: string; email: string };
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [currentBoard, setCurrentBoard] = useState('Home Board');
  const [boards] = useState(['Home Board', 'Work Board', 'Personal Board']);
  const [isChoreModalOpen, setIsChoreModalOpen] = useState(false);
  const [editingChore, setEditingChore] = useState<Chore | undefined>();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const [chores, setChores] = useState<Chore[]>([
    {
      id: '1',
      title: 'Clean the kitchen',
      description: 'Deep clean counters, sink, and stovetop',
      dueDate: new Date(2024, 6, 28),
      category: 'Cleaning',
      icon: '🧹',
      assignees: [{ id: '1', name: 'John Doe' }],
      status: 'todo',
      priority: 'high',
      recurring: 'weekly'
    },
    {
      id: '2',
      title: 'Grocery shopping',
      description: 'Buy ingredients for the week',
      dueDate: new Date(2024, 6, 26),
      category: 'Shopping',
      icon: '🛒',
      assignees: [{ id: '1', name: 'John Doe' }],
      status: 'in-progress',
      priority: 'medium',
      recurring: 'weekly'
    },
    {
      id: '3',
      title: 'Water plants',
      description: 'Water all indoor and outdoor plants',
      category: 'Outdoor',
      icon: '🌱',
      assignees: [{ id: '1', name: 'John Doe' }],
      status: 'done',
      priority: 'low',
      recurring: 'daily'
    },
    {
      id: '4',
      title: 'Take out trash',
      description: 'Empty all bins and take to curb',
      dueDate: new Date(2024, 6, 27),
      category: 'Cleaning',
      icon: '🗑️',
      assignees: [{ id: '1', name: 'John Doe' }],
      status: 'todo',
      priority: 'medium',
      recurring: 'weekly'
    },
    {
      id: '5',
      title: 'Walk the dog',
      description: 'Morning walk around the block',
      category: 'Pet Care',
      icon: '🐕',
      assignees: [{ id: '1', name: 'John Doe' }],
      status: 'done',
      priority: 'low',
      recurring: 'daily'
    }
  ]);

  const handleAddChore = () => {
    setEditingChore(undefined);
    setIsChoreModalOpen(true);
  };

  const handleEditChore = (chore: Chore) => {
    setEditingChore(chore);
    setIsChoreModalOpen(true);
  };

  const handleSaveChore = (choreData: Partial<Chore>) => {
    if (editingChore) {
      setChores(prev => prev.map(chore => 
        chore.id === editingChore.id ? { ...chore, ...choreData } : chore
      ));
    } else {
      const newChore: Chore = {
        id: Date.now().toString(),
        title: choreData.title || '',
        description: choreData.description,
        dueDate: choreData.dueDate,
        category: choreData.category || 'Cleaning',
        icon: choreData.icon || '🧹',
        assignees: choreData.assignees || [{ id: user.id, name: user.name }],
        status: choreData.status || 'todo',
        priority: choreData.priority || 'medium',
        recurring: choreData.recurring || 'none'
      };
      setChores(prev => [...prev, newChore]);
    }
  };

  const handleStatusChange = (choreId: string, newStatus: Chore['status']) => {
    setChores(prev => prev.map(chore => {
      if (chore.id === choreId) {
        if (newStatus === 'done' && chore.recurring && chore.recurring !== 'none') {
          const newDueDate = new Date();
          switch (chore.recurring) {
            case 'daily':
              newDueDate.setDate(newDueDate.getDate() + 1);
              break;
            case 'weekly':
              newDueDate.setDate(newDueDate.getDate() + 7);
              break;
            case 'monthly':
              newDueDate.setMonth(newDueDate.getMonth() + 1);
              break;
          }
          
          const newChore: Chore = {
            ...chore,
            id: Date.now().toString(),
            status: 'todo',
            dueDate: newDueDate
          };
          
          setTimeout(() => {
            setChores(prev => [...prev, newChore]);
          }, 500);
        }
        
        return { ...chore, status: newStatus };
      }
      return chore;
    }));
  };

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  const handleAddFilter = (filter: string) => {
    setActiveFilters(prev => [...prev, filter]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentBoard={currentBoard}
        boards={boards}
        onBoardChange={setCurrentBoard}
        onAddChore={handleAddChore}
        onLogout={onLogout}
        user={user}
      />

      <FilterChips 
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onAddFilter={handleAddFilter}
      />

      <main className="px-4 py-6 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Responsive grid layout matching Figma */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {chores.map((chore, index) => (
              <div 
                key={chore.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <ChoreCard
                  chore={chore}
                  onEdit={handleEditChore}
                  onStatusChange={handleStatusChange}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <ChoreModal
        isOpen={isChoreModalOpen}
        onClose={() => setIsChoreModalOpen(false)}
        onSave={handleSaveChore}
        chore={editingChore}
        isEditing={!!editingChore}
      />
    </div>
  );
};

export default Dashboard;
