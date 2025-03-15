
import { useState, useCallback, useEffect } from 'react';
import { 
  translateText, 
  getTranslationHistory, 
  clearTranslationHistory,
  getUserPreferences,
  updateUserPreferences,
  translateDocument
} from '@/lib/translationService';
import { toast } from '@/components/ui/use-toast';
import { detectLanguage } from '@/lib/languageUtils';

interface UseTranslationOptions {
  autoDetect?: boolean;
  defaultSourceLang?: string;
  defaultTargetLang?: string;
}

export function useTranslation(options?: UseTranslationOptions) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState(options?.defaultSourceLang || 'en');
  const [targetLanguage, setTargetLanguage] = useState(options?.defaultTargetLang || 'es');
  const [detectedLanguage, setDetectedLanguage] = useState<string | undefined>();
  const [isTranslating, setIsTranslating] = useState(false);
  const [confidence, setConfidence] = useState<number | undefined>();
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [history, setHistory] = useState<ReturnType<typeof getTranslationHistory>>([]);
  const [preferences, setPreferences] = useState(getUserPreferences());
  
  // Load user preferences on mount
  useEffect(() => {
    const userPrefs = getUserPreferences();
    setPreferences(userPrefs);
    
    // Apply preferences
    if (userPrefs.defaultSourceLanguage && !options?.defaultSourceLang) {
      setSourceLanguage(userPrefs.defaultSourceLanguage);
    }
    
    if (userPrefs.defaultTargetLanguage && !options?.defaultTargetLang) {
      setTargetLanguage(userPrefs.defaultTargetLanguage);
    }
    
    // Load history
    refreshHistory();
  }, []);
  
  // Auto-detect language when input changes
  useEffect(() => {
    if (inputText.trim().length > 3 && (options?.autoDetect || preferences.autoDetect)) {
      const detected = detectLanguage(inputText);
      setDetectedLanguage(detected);
      setSourceLanguage(detected);
    }
  }, [inputText, options?.autoDetect, preferences.autoDetect]);
  
  const translate = useCallback(async () => {
    if (!inputText.trim() || isTranslating) return;
    
    setIsTranslating(true);
    try {
      const result = await translateText({
        text: inputText,
        sourceLanguage,
        targetLanguage,
      });
      
      setOutputText(result.translatedText);
      if (result.detectedLanguage) {
        setDetectedLanguage(result.detectedLanguage);
      }
      if (result.confidence !== undefined) {
        setConfidence(result.confidence);
      }
      setAlternatives(result.alternativeTranslations || []);
      
      // Refresh history
      refreshHistory();
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Failed",
        description: "An error occurred while translating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, sourceLanguage, targetLanguage, isTranslating]);
  
  const refreshHistory = useCallback(() => {
    setHistory(getTranslationHistory());
  }, []);
  
  const handleClearHistory = useCallback(() => {
    clearTranslationHistory();
    refreshHistory();
    toast({
      title: "History Cleared",
      description: "Your translation history has been cleared.",
    });
  }, [refreshHistory]);
  
  const handleUpdatePreferences = useCallback((newPrefs: Partial<typeof preferences>) => {
    const updated = updateUserPreferences(newPrefs);
    setPreferences(updated);
    toast({
      title: "Preferences Updated",
      description: "Your translation preferences have been saved.",
    });
    return updated;
  }, []);
  
  const handleSwapLanguages = useCallback(() => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(outputText);
    setOutputText('');
  }, [sourceLanguage, targetLanguage, outputText]);
  
  const handleTranslateFile = useCallback(async (file: File) => {
    if (!file) return;
    
    toast({
      title: "Processing Document",
      description: `Translating ${file.name}...`,
    });
    
    try {
      const result = await translateDocument(file, targetLanguage);
      
      if (result.success && result.url) {
        toast({
          title: "Document Translated",
          description: "Your document has been translated successfully.",
        });
        return result.url;
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Document translation error:", error);
      toast({
        title: "Document Translation Failed",
        description: error instanceof Error ? error.message : "Failed to translate document",
        variant: "destructive",
      });
      return null;
    }
  }, [targetLanguage]);
  
  return {
    // State
    inputText,
    outputText,
    sourceLanguage,
    targetLanguage,
    detectedLanguage,
    isTranslating,
    confidence,
    alternatives,
    history,
    preferences,
    
    // Actions
    setInputText,
    setOutputText,
    setSourceLanguage,
    setTargetLanguage,
    translate,
    handleSwapLanguages,
    handleClearHistory,
    handleUpdatePreferences,
    handleTranslateFile,
  };
}
