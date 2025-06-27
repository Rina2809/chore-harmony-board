import React, { useState } from 'react';
import Header from './Header';
import ChoreModal from './ChoreModal';
import ProfileModal from './ProfileModal';
import FilterChips from './FilterChips';
import StatsSection from './StatsSection';
import ChoreBoard from './ChoreBoard';
import { Chore } from './ChoreCard';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  households?: string[];
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user: initialUser, onLogout }: DashboardProps) => {
  const [user, setUser] = useState<User>(initialUser);
  const [currentBoard, setCurrentBoard] = useState('Home Board');
  const [boards] = useState(['Home Board', 'Work Board', 'Personal Board']);
  const [isChoreModalOpen, setIsChoreModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
      hatePoints: 5,
      priority: 'high',
      recurring: 'weekly',
      isCompleted: false
    },
    {
      id: '2',
      title: 'Grocery shopping',
      description: 'Buy ingredients for the week',
      dueDate: new Date(2024, 6, 26),
      category: 'Shopping',
      icon: '🛒',
      assignees: [{ id: '1', name: 'John Doe' }],
      hatePoints: 2,
      priority: 'medium',
      recurring: 'weekly',
      isCompleted: false
    },
    {
      id: '3',
      title: 'Water plants',
      description: 'Water all indoor and outdoor plants',
      category: 'Outdoor',
      icon: '🌱',
      assignees: [{ id: '1', name: 'John Doe' }],
      hatePoints: 1,
      priority: 'low',
      recurring: 'daily',
      isCompleted: true,
      completedAt: new Date()
    },
    {
      id: '4',
      title: 'Take out trash',
      description: 'Empty all bins and take to curb',
      dueDate: new Date(2024, 6, 27),
      category: 'Cleaning',
      icon: '🗑️',
      assignees: [{ id: '1', name: 'John Doe' }],
      hatePoints: 3,
      priority: 'medium',
      recurring: 'weekly',
      isCompleted: false
    },
    {
      id: '5',
      title: 'Walk the dog',
      description: 'Morning walk around the block',
      category: 'Pet Care',
      icon: '🐕',
      assignees: [{ id: '1', name: 'John Doe' }],
      hatePoints: 1,
      priority: 'low',
      recurring: 'daily',
      isCompleted: true,
      completedAt: new Date()
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
        hatePoints: choreData.hatePoints || 1,
        priority: choreData.priority || 'medium',
        recurring: choreData.recurring || 'none',
        isCompleted: false
      };
      setChores(prev => [...prev, newChore]);
    }
  };

  const handleToggleComplete = (choreId: string) => {
    setChores(prev => prev.map(chore => {
      if (chore.id === choreId) {
        const isCompleting = !chore.isCompleted;
        
        // Only create a new recurring chore if we're completing it (not uncompleting)
        if (isCompleting && chore.recurring && chore.recurring !== 'none') {
          // Create a new recurring chore
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
            isCompleted: false,
            completedAt: undefined,
            dueDate: newDueDate
          };
          
          setTimeout(() => {
            setChores(prev => [...prev, newChore]);
          }, 500);
        }
        
        return { 
          ...chore, 
          isCompleted: isCompleting,
          completedAt: isCompleting ? new Date() : undefined
        };
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

  // Filter chores based on active filters
  const filteredChores = activeFilters.length > 0 
    ? chores.filter(chore => activeFilters.includes(chore.category))
    : chores;

  const handleProfileSave = (userData: User) => {
    setUser(userData);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentBoard={currentBoard}
        boards={boards}
        onBoardChange={setCurrentBoard}
        onAddChore={handleAddChore}
        onOpenProfile={() => setIsProfileModalOpen(true)}
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
          {/* Stats Section */}
          <StatsSection chores={chores} />
          
          {/* Chore Board */}
          <ChoreBoard
            chores={filteredChores}
            onEdit={handleEditChore}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </main>

      <ChoreModal
        isOpen={isChoreModalOpen}
        onClose={() => setIsChoreModalOpen(false)}
        onSave={handleSaveChore}
        chore={editingChore}
        isEditing={!!editingChore}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default Dashboard;
