
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, ChevronDown, Settings, LogOut, User } from 'lucide-react';

interface HeaderProps {
  currentBoard: string;
  boards: string[];
  onBoardChange: (board: string) => void;
  onAddChore: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  user: { name: string; email: string; avatar?: string };
}

const Header = ({ currentBoard, boards, onBoardChange, onAddChore, onLogout, onOpenProfile, user }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-4 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Board dropdown */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:bg-gray-50 px-3 py-2">
                <span>{currentBoard}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white shadow-lg border border-gray-200">
              {boards.map((board) => (
                <DropdownMenuItem 
                  key={board} 
                  onClick={() => onBoardChange(board)}
                  className="hover:bg-gray-50"
                >
                  {board}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Add Chore button */}
        <Button 
          onClick={onAddChore}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 py-2.5 rounded-full font-medium shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Chore
        </Button>

        {/* Right: User avatar */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:ring-2 hover:ring-[#22C55E] hover:ring-opacity-50 transition-all duration-200 w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-[#F3F4F6] text-gray-700 text-sm font-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200">
              <DropdownMenuItem onClick={onOpenProfile} className="hover:bg-gray-50">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-2 text-gray-500" />
                App Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout} className="hover:bg-gray-50">
                <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
