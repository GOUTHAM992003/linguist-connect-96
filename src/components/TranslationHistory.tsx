
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getLanguageByCode, formatLanguagePair } from '@/lib/languageUtils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Trash2 } from 'lucide-react';

interface HistoryItem {
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

interface TranslationHistoryProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelectItem: (item: HistoryItem) => void;
}

const TranslationHistory: React.FC<TranslationHistoryProps> = ({
  history,
  onClear,
  onSelectItem,
}) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <History className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your translation history will appear here
        </p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg">
      <div className="p-3 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800">
        <h3 className="font-medium">Recent Translations</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 text-xs"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          Clear History
        </Button>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="divide-y">
          {history.map((item, index) => (
            <div 
              key={index}
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer"
              onClick={() => onSelectItem(item)}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div className="text-xs flex items-center">
                  <span className="text-base mr-2">
                    {getLanguageByCode(item.sourceLanguage).flag}
                  </span>
                  <span className="font-medium">{getLanguageByCode(item.sourceLanguage).name}</span>
                  <span className="mx-1">→</span>
                  <span className="text-base mr-2">
                    {getLanguageByCode(item.targetLanguage).flag}
                  </span>
                  <span className="font-medium">{getLanguageByCode(item.targetLanguage).name}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </div>
              </div>
              
              <div className="line-clamp-1 text-sm mb-1">{item.sourceText}</div>
              <div className="line-clamp-1 text-sm text-brand-600 dark:text-brand-400">
                {item.targetText}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TranslationHistory;
