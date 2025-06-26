
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart } from 'lucide-react';

interface HatePointsSectionProps {
  hatePoints: number;
  onHatePointsChange: (points: number) => void;
}

const HatePointsSection = ({ hatePoints, onHatePointsChange }: HatePointsSectionProps) => {
  const hatePointsOptions = [
    { value: 1, label: 'Mildly Annoying', description: 'Not too bad' },
    { value: 2, label: 'I have done worse', description: 'Manageable' },
    { value: 3, label: 'This is worse', description: 'Getting annoying' },
    { value: 4, label: 'Hate it', description: 'Really don\'t want to do this' },
    { value: 5, label: 'Really hate it', description: 'Strongly dislike' },
    { value: 6, label: 'Absolutely despise', description: 'Almost unbearable' },
    { value: 7, label: 'Pure agony', description: 'The worst possible task' }
  ];

  const getHatePointsColor = (points: number) => {
    if (points <= 2) return 'text-green-600 border-green-200';
    if (points <= 4) return 'text-yellow-600 border-yellow-200';
    return 'text-red-600 border-red-200';
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">Hate Level (1-7)</Label>
      <RadioGroup 
        value={hatePoints.toString()} 
        onValueChange={(value) => onHatePointsChange(parseInt(value))}
        className="grid grid-cols-1 gap-3"
      >
        {hatePointsOptions.map((option) => (
          <div key={option.value} className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
            hatePoints === option.value ? getHatePointsColor(option.value) : 'border-gray-200'
          }`}>
            <RadioGroupItem value={option.value.toString()} id={`hate-${option.value}`} />
            <div className="flex items-center space-x-2 flex-1">
              <Heart className={`w-4 h-4 ${getHatePointsColor(option.value).split(' ')[0]}`} fill="currentColor" />
              <div className="flex-1">
                <Label htmlFor={`hate-${option.value}`} className="font-medium cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
              <span className="text-sm font-medium text-gray-600">{option.value}/7</span>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default HatePointsSection;
