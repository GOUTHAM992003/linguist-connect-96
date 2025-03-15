
import React, { useState, useEffect } from 'react';
import { Clipboard, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranslationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onTranslate: () => void;
  isBusy?: boolean;
}

const TranslationInput: React.FC<TranslationInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter text to translate...',
  className,
  onTranslate,
  isBusy = false,
}) => {
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  const handleCopy = () => {
    if (!value.trim()) return;
    
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey === false && e.ctrlKey === true) {
      e.preventDefault();
      onTranslate();
    }
  };
  
  return (
    <div className={cn("relative", className)}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isBusy}
        className={cn(
          "w-full h-full min-h-[200px] p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/20",
          "text-base bg-transparent transition-all placeholder:text-muted-foreground/70",
          isBusy && "opacity-70 cursor-not-allowed"
        )}
      />
      
      <div className="absolute bottom-3 right-3 flex gap-2">
        {value.trim().length > 0 && (
          <button
            onClick={handleCopy}
            type="button"
            className="p-2 rounded-lg bg-white/80 hover:bg-white text-muted-foreground hover:text-foreground transition-colors"
          >
            <Clipboard className="h-4 w-4" />
            {copied && (
              <span className="absolute top-0 right-full mr-2 px-2 py-1 text-xs bg-black text-white rounded animate-fade-in">
                Copied!
              </span>
            )}
          </button>
        )}
        
        <button
          onClick={onTranslate}
          disabled={!value.trim() || isBusy}
          type="button"
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            "bg-brand-500 text-white shadow-sm",
            "hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30",
            (!value.trim() || isBusy) ? "opacity-50 cursor-not-allowed" : "button-animation"
          )}
        >
          Translate
          <CornerDownLeft className="h-3.5 w-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default TranslationInput;
