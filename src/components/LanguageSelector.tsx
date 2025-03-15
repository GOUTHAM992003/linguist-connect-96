
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { languages, getLanguageByCode } from '../lib/languageUtils';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  showDetected?: boolean;
  detectedLanguage?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className,
  showDetected = false,
  detectedLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLanguage = getLanguageByCode(value);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSelect = (langCode: string) => {
    onChange(langCode);
    setIsOpen(false);
  };
  
  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
          "hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-brand-500/20 button-animation",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          isOpen ? "border-brand-300 bg-brand-50" : "border-border"
        )}
      >
        <span className="text-base leading-none mr-1">{selectedLanguage.flag}</span>
        <span className="font-medium">{selectedLanguage.name}</span>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform duration-200",
          isOpen ? "rotate-180" : ""
        )} />
      </button>
      
      {showDetected && detectedLanguage && (
        <div className="mt-2 text-xs text-muted-foreground flex items-center">
          <Globe className="h-3 w-3 mr-1" />
          <span>Detected: {getLanguageByCode(detectedLanguage).name}</span>
        </div>
      )}
      
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg glass-panel animate-fade-in">
          <div className="py-1 px-2">
            {languages.map((language) => (
              <button
                key={language.code}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md flex items-center",
                  "transition-colors duration-200 ease-in-out",
                  language.code === value
                    ? "bg-brand-50 text-brand-900"
                    : "hover:bg-muted"
                )}
                onClick={() => handleSelect(language.code)}
              >
                <span className="text-base leading-none mr-2">{language.flag}</span>
                <span className="flex-1">{language.name}</span>
                {language.code === value && (
                  <Check className="h-4 w-4 text-brand-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
