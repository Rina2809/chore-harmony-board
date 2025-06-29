
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useHouseholds } from '@/hooks/useHouseholds';
import { useChores } from '@/hooks/useChores';
import Header from './Header';
import ChoreModal from './ChoreModal';
import ProfileModal from './ProfileModal';
import ChoreSorting, { SortOption, SortDirection } from './ChoreSorting';
import StatsSection from './StatsSection';
import ChoreBoard from './ChoreBoard';
import WelcomePage from '../Welcome/WelcomePage';

const Dashboard = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { households } = useHouseholds();
  const [currentHouseholdId, setCurrentHouseholdId] = useState<string>('');
  const [isChoreModalOpen, setIsChoreModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingChore, setEditingChore] = useState<any>();
  const [sortBy, setSortBy] = useState<SortOption>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Set the first household as current if none selected
  React.useEffect(() => {
    if (households.length > 0 && !currentHouseholdId) {
      setCurrentHouseholdId(households[0].id);
    }
  }, [households, currentHouseholdId]);

  const { chores, addChore, updateChore, toggleComplete } = useChores(currentHouseholdId);
  
  const currentHousehold = households.find(h => h.id === currentHouseholdId);
  const boardNames = households.map(h => h.name);

  // Show welcome page if user has no households
  if (households.length === 0) {
    return (
      <WelcomePage 
        onHouseholdSelected={(householdId) => setCurrentHouseholdId(householdId)}
      />
    );
  }

  const handleAddChore = () => {
    setEditingChore(undefined);
    setIsChoreModalOpen(true);
  };

  const handleEditChore = (chore: any) => {
    setEditingChore(chore);
    setIsChoreModalOpen(true);
  };

  const handleSaveChore = async (choreData: any) => {
    if (editingChore) {
      await updateChore(editingChore.id, choreData);
    } else {
      await addChore(choreData);
    }
  };

  const handleToggleComplete = async (choreId: string) => {
    await toggleComplete(choreId);
  };

  const handleBoardChange = (boardName: string) => {
    const household = households.find(h => h.name === boardName);
    if (household) {
      setCurrentHouseholdId(household.id);
    }
  };

  const handleSortChange = (newSortBy: SortOption, newDirection: SortDirection) => {
    setSortBy(newSortBy);
    setSortDirection(newDirection);
  };

  // Sort chores based on selected criteria
  const sortedChores = [...chores].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'priority':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'due_date':
        const aDate = a.due_date ? new Date(a.due_date).getTime() : 0;
        const bDate = b.due_date ? new Date(b.due_date).getTime() : 0;
        comparison = aDate - bDate;
        break;
      case 'created_at':
        comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Transform chores to match the expected format
  const transformedChores = sortedChores.map(chore => ({
    ...chore,
    dueDate: chore.due_date ? new Date(chore.due_date) : undefined,
    completedAt: chore.completed_at ? new Date(chore.completed_at) : undefined,
    hatePoints: chore.hate_points,
    isCompleted: chore.is_completed,
    assignees: chore.assignments.map(assignment => ({
      id: assignment.user_id,
      name: assignment.profiles?.name || 'Unknown',
      avatar: assignment.profiles?.avatar_url
    }))
  }));

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentBoard={currentHousehold?.name || 'No Household'}
        boards={boardNames}
        onBoardChange={handleBoardChange}
        onAddChore={handleAddChore}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={signOut}
        user={{
          name: profile.name,
          email: profile.id,
          avatar: profile.avatar_url
        }}
      />

      <div className="px-4 py-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ChoreSorting 
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      <main className="px-4 py-2 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Section */}
          <StatsSection chores={transformedChores} />
          
          {/* Chore Board */}
          <ChoreBoard
            chores={transformedChores}
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
        user={{
          id: profile.id,
          name: profile.name,
          email: profile.id,
          avatar: profile.avatar_url,
          bio: profile.bio,
          households: households.map(h => h.name)
        }}
        onSave={async (userData) => {
          // This will be handled by the ProfileModal component
        }}
      />
    </div>
  );
};

export default Dashboard;
