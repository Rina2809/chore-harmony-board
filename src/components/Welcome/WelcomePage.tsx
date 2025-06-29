import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useHouseholds } from '@/hooks/useHouseholds';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Plus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WelcomePageProps {
  onHouseholdSelected: (householdId: string) => void;
}

const WelcomePage = ({ onHouseholdSelected }: WelcomePageProps) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { households, loading } = useHouseholds();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [householdName, setHouseholdName] = useState('');
  const [householdDescription, setHouseholdDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !householdName.trim()) return;

    setCreating(true);
    try {
      // Create household
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({
          name: householdName.trim(),
          description: householdDescription.trim() || null,
          created_by: user.id
        })
        .select()
        .single();

      if (householdError) throw householdError;

      // Add creator as household member
      const { error: memberError } = await supabase
        .from('household_members')
        .insert({
          household_id: household.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast({
        title: "Household created!",
        description: `Welcome to ${householdName}!`,
      });

      onHouseholdSelected(household.id);
    } catch (error) {
      console.error('Error creating household:', error);
      toast({
        title: "Error",
        description: "Failed to create household. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your households...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-green-100 text-green-700">
                  {profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.name}!</h1>
                <p className="text-gray-600">Let's get you set up with a household</p>
              </div>
            </div>
            <Button variant="outline" onClick={signOut}>
              Logout
            </Button>
          </div>
        </div>

        {/* Login Code Display */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <Users className="w-5 h-5" />
              <span>Your Login Code</span>
            </CardTitle>
            <CardDescription className="text-blue-700">
              Share this code with family members so they can join your households
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <code className="text-lg font-mono font-bold text-blue-900">
                {user?.id.slice(0, 8).toUpperCase()}
              </code>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Existing Households */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Households</h2>
            {households.length > 0 ? (
              <div className="space-y-3">
                {households.map((household) => (
                  <Card key={household.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{household.name}</h3>
                          {household.description && (
                            <p className="text-sm text-gray-600 mt-1">{household.description}</p>
                          )}
                        </div>
                        <Button 
                          onClick={() => onHouseholdSelected(household.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Enter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">You're not part of any households yet</p>
                  <p className="text-sm text-gray-500 mt-2">Create your first household to get started</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Create New Household */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Household</h2>
            {!showCreateForm ? (
              <Card className="border-dashed border-2 border-green-300 hover:border-green-400 transition-colors cursor-pointer">
                <CardContent 
                  className="p-8 text-center"
                  onClick={() => setShowCreateForm(true)}
                >
                  <Plus className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium">Create a new household</p>
                  <p className="text-sm text-gray-500 mt-2">Start managing chores with your family</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Create Household</CardTitle>
                  <CardDescription>
                    Set up a new household to start managing chores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateHousehold} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Household Name</Label>
                      <Input
                        id="name"
                        value={householdName}
                        onChange={(e) => setHouseholdName(e.target.value)}
                        placeholder="e.g., The Smith Family"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={householdDescription}
                        onChange={(e) => setHouseholdDescription(e.target.value)}
                        placeholder="A brief description of your household..."
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        type="submit" 
                        disabled={creating}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {creating ? 'Creating...' : 'Create Household'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
