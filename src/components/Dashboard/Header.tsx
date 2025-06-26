
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, ChevronDown, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  currentBoard: string;
  boards: string[];
  onBoardChange: (board: string) => void;
  onAddChore: () => void;
  onLogout: () => void;
  user: { name: string; email: string };
}

const Header = ({ currentBoard, boards, onBoardChange, onAddChore, onLogout, user }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-lg font-semibold">
                <span>{currentBoard}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {boards.map((board) => (
                <DropdownMenuItem key={board} onClick={() => onBoardChange(board)}>
                  {board}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            onClick={onAddChore}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Chore
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:ring-2 hover:ring-green-500 transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-green-100 text-green-800">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
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
