
import React, { useState, useEffect } from 'react';
import { Clipboard, VolumeIcon, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranslationOutputProps {
  text: string;
  loading?: boolean;
  fromMemory?: boolean;
  className?: string;
}

const TranslationOutput: React.FC<TranslationOutputProps> = ({
  text,
  loading = false,
  fromMemory = false,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  const handleCopy = () => {
    if (!text.trim()) return;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
    });
  };
  
  const handleSpeak = () => {
    if (!text.trim() || !window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };
  
  return (
    <div className={cn("relative", className)}>
      {loading ? (
        <div className="w-full h-full min-h-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full border-2 border-brand-300 border-t-brand-600 animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Translating...</p>
          </div>
        </div>
      ) : text ? (
        <>
          <div className="w-full h-full min-h-[200px] p-4 rounded-lg text-base overflow-y-auto animate-fade-in">
            {text}
            {fromMemory && (
              <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full ml-2">
                <Database className="h-3 w-3" />
                From memory
              </div>
            )}
          </div>
          
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={handleSpeak}
              type="button"
              className="p-2 rounded-lg bg-white/80 hover:bg-white text-muted-foreground hover:text-foreground transition-colors"
            >
              <VolumeIcon className="h-4 w-4" />
            </button>
            
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
          </div>
        </>
      ) : (
        <div className="w-full h-full min-h-[200px] flex items-center justify-center text-muted-foreground/70 text-sm">
          Translated text will appear here
        </div>
      )}
    </div>
  );
};

export default TranslationOutput;
