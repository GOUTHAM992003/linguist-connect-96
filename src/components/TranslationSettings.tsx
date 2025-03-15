
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Briefcase, BookOpen, Stethoscope, Scale, BarChart4, GraduationCap, Sparkles } from 'lucide-react';

interface TranslationSettingsProps {
  domain: string;
  formalityLevel: string;
  useTranslationMemory: boolean;
  onUpdateSettings: (settings: {
    domain?: string;
    formalityLevel?: string;
    useTranslationMemory?: boolean;
  }) => void;
  className?: string;
}

const TranslationSettings: React.FC<TranslationSettingsProps> = ({
  domain,
  formalityLevel,
  useTranslationMemory,
  onUpdateSettings,
  className = ''
}) => {
  return (
    <div className={`p-4 rounded-lg border bg-white dark:bg-slate-800 ${className}`}>
      <h3 className="text-lg font-medium mb-4">Translation Settings</h3>
      
      <div className="space-y-6">
        {/* Domain Selection */}
        <div className="space-y-2">
          <Label htmlFor="domain-select">Specialized Domain</Label>
          <Select
            value={domain}
            onValueChange={(value) => onUpdateSettings({ domain: value })}
          >
            <SelectTrigger id="domain-select" className="w-full">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-gray-500" />
                  <span>General</span>
                </div>
              </SelectItem>
              <SelectItem value="technical">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Technical</span>
                </div>
              </SelectItem>
              <SelectItem value="medical">
                <div className="flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2 text-red-500" />
                  <span>Medical</span>
                </div>
              </SelectItem>
              <SelectItem value="legal">
                <div className="flex items-center">
                  <Scale className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Legal</span>
                </div>
              </SelectItem>
              <SelectItem value="financial">
                <div className="flex items-center">
                  <BarChart4 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Financial</span>
                </div>
              </SelectItem>
              <SelectItem value="academic">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Academic</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a domain to get translations optimized for specific terminology
          </p>
        </div>
        
        {/* Formality Level */}
        <div className="space-y-2">
          <Label htmlFor="formality-select">Formality Level</Label>
          <Select
            value={formalityLevel}
            onValueChange={(value) => onUpdateSettings({ formalityLevel: value })}
          >
            <SelectTrigger id="formality-select" className="w-full">
              <SelectValue placeholder="Select formality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="informal">Informal</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Adjust how formal or casual the translation should be
          </p>
        </div>
        
        {/* Translation Memory Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="memory-switch">Translation Memory</Label>
            <p className="text-xs text-muted-foreground">
              Use previously translated content to improve consistency
            </p>
          </div>
          <Switch
            id="memory-switch"
            checked={useTranslationMemory}
            onCheckedChange={(checked) => onUpdateSettings({ useTranslationMemory: checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default TranslationSettings;
