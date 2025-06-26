
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Chore } from './ChoreCard';

interface StatsSectionProps {
  chores: Chore[];
}

const StatsSection = ({ chores }: StatsSectionProps) => {
  const totalChores = chores.length;
  const completedChores = chores.filter(chore => chore.isCompleted).length;
  const pendingChores = totalChores - completedChores;
  const completionRate = totalChores > 0 ? (completedChores / totalChores) * 100 : 0;

  // Hate points analysis
  const totalHatePoints = chores.reduce((sum, chore) => sum + chore.hatePoints, 0);
  const avgHatePoints = totalChores > 0 ? totalHatePoints / totalChores : 0;
  const highHateChores = chores.filter(chore => chore.hatePoints >= 5).length;

  // Most hated categories
  const categoryHatePoints = chores.reduce((acc, chore) => {
    acc[chore.category] = (acc[chore.category] || 0) + chore.hatePoints;
    return acc;
  }, {} as Record<string, number>);

  const mostHatedCategory = Object.entries(categoryHatePoints)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

  // Weekly completion trend (mock data for now)
  const weeklyCompletion = 75; // This would be calculated based on actual completion data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Completion Rate */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{completionRate.toFixed(0)}%</div>
          <Progress value={completionRate} className="mt-2" />
          <p className="text-xs text-gray-500 mt-2">
            {completedChores} of {totalChores} chores completed
          </p>
        </CardContent>
      </Card>

      {/* Average Hate Points */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Avg Hate Level</CardTitle>
          <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{avgHatePoints.toFixed(1)}/7</div>
          <Progress 
            value={(avgHatePoints / 7) * 100} 
            className="mt-2"
          />
          <p className="text-xs text-gray-500 mt-2">
            {highHateChores} high-hate chores (≥5 points)
          </p>
        </CardContent>
      </Card>

      {/* Pending Chores */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Pending</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{pendingChores}</div>
          <p className="text-xs text-gray-500 mt-2">
            Chores awaiting completion
          </p>
        </CardContent>
      </Card>

      {/* Most Hated Category */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Most Hated</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-gray-900">{mostHatedCategory}</div>
          <p className="text-xs text-gray-500 mt-2">
            Category with highest hate points
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSection;
