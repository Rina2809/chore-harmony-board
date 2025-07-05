
import React from 'react';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, Plus, X } from 'lucide-react';
import { useHouseholdMembers } from '@/hooks/useHouseholdMembers';

interface AssigneeSectionProps {
  householdId: string;
  selectedAssignees: string[];
  onAssigneesChange: (assignees: string[]) => void;
}

const AssigneeSection = ({ householdId, selectedAssignees, onAssigneesChange }: AssigneeSectionProps) => {
  const { members, loading } = useHouseholdMembers(householdId);

  const toggleAssignee = (userId: string) => {
    if (selectedAssignees.includes(userId)) {
      onAssigneesChange(selectedAssignees.filter(id => id !== userId));
    } else {
      onAssigneesChange([...selectedAssignees, userId]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Assignees</Label>
        <div className="text-sm text-gray-500">Loading household members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">Assign To</Label>
      <div className="space-y-2">
        {members.map((member) => {
          const isSelected = selectedAssignees.includes(member.user_id);
          return (
            <div
              key={member.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                isSelected 
                  ? 'border-[#22C55E] bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => toggleAssignee(member.user_id)}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={member.profiles?.avatar_url} />
                <AvatarFallback className="text-xs bg-gray-200 text-gray-700 font-medium">
                  {member.profiles?.name?.split(' ').map(n => n[0]).join('') || '?'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="font-medium text-gray-900">{member.profiles?.name || 'Unknown'}</div>
                <div className="text-sm text-gray-500 capitalize">{member.role}</div>
              </div>
              
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                isSelected 
                  ? 'border-[#22C55E] bg-[#22C55E]' 
                  : 'border-gray-300'
              }`}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
          );
        })}
        
        {members.length === 0 && (
          <div className="text-sm text-gray-500 py-4 text-center">
            No household members found
          </div>
        )}
      </div>
      
      {selectedAssignees.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedAssignees.map((userId) => {
            const member = members.find(m => m.user_id === userId);
            return (
              <div
                key={userId}
                className="flex items-center space-x-1 bg-[#22C55E] text-white px-2 py-1 rounded-full text-xs"
              >
                <span>{member?.profiles?.name || 'Unknown'}</span>
                <button
                  type="button"
                  onClick={() => toggleAssignee(userId)}
                  className="hover:bg-green-600 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssigneeSection;
