
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Home } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  households?: string[];
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (userData: User) => void;
}

const ProfileModal = ({ isOpen, onClose, user }: ProfileModalProps) => {
  const [formData, setFormData] = useState<User>(user);
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatar || '');
  const [loading, setLoading] = useState(false);
  
  const { updateProfile } = useProfile();
  const { toast } = useToast();

  useEffect(() => {
    setFormData(user);
    setAvatarPreview(user.avatar || '');
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await updateProfile({
      name: formData.name,
      bio: formData.bio,
      avatar_url: avatarPreview
    });

    if (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      onClose();
    }

    setLoading(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="text-xl bg-gray-200 text-gray-700 font-medium">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-[#22C55E] text-white p-2 rounded-full cursor-pointer hover:bg-[#16A34A] transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAvatarPreview('')}
              className="text-xs"
            >
              Remove Photo
            </Button>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              className="border-gray-200 focus:border-[#22C55E] focus:ring-[#22C55E]"
              required
            />
          </div>

          {/* Households */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Households</Label>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Home className="w-4 h-4" />
                <span>You are part of these households:</span>
              </div>
              <div className="mt-2 space-y-1">
                {formData.households && formData.households.length > 0 ? (
                  formData.households.map((household, index) => (
                    <div key={index} className="bg-white px-3 py-2 rounded border text-sm">
                      {household}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No households assigned yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={3}
              className="border-gray-200 focus:border-[#22C55E] focus:ring-[#22C55E]"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6 py-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 py-2 shadow-sm"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
