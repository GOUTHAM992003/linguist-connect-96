import { useState, useCallback, useEffect } from 'react';
import { 
  translateText, 
  getTranslationHistory, 
  clearTranslationHistory,
  getUserPreferences,
  updateUserPreferences,
  translateDocument,
  batchTranslateTexts,
  getBatchTranslationStatus
} from '@/lib/translationService';
import { toast } from '@/components/ui/use-toast';
import { detectLanguage } from '@/lib/languageUtils';

interface UseTranslationOptions {
  autoDetect?: boolean;
  defaultSourceLang?: string;
  defaultTargetLang?: string;
  domain?: 'general' | 'technical' | 'medical' | 'legal' | 'financial' | 'academic';
  formalityLevel?: 'formal' | 'neutral' | 'informal';
  useTranslationMemory?: boolean;
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
  const [domain, setDomain] = useState<UseTranslationOptions['domain']>(options?.domain || 'general');
  const [formalityLevel, setFormalityLevel] = useState<UseTranslationOptions['formalityLevel']>(
    options?.formalityLevel || 'neutral'
  );
  const [useTranslationMemory, setUseTranslationMemory] = useState<boolean>(
    options?.useTranslationMemory !== false
  );
  const [fromMemory, setFromMemory] = useState(false);
  
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
  
  // Basic translation function
  const basicTranslate = useCallback(async () => {
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
  
  // Advanced translation with options
  const translateWithOptions = useCallback(async () => {
    if (!inputText.trim() || isTranslating) return;
    
    setIsTranslating(true);
    setFromMemory(false);
    
    try {
      const result = await translateText({
        text: inputText,
        sourceLanguage,
        targetLanguage,
        domain,
        formalityLevel,
        useTranslationMemory
      });
      
      setOutputText(result.translatedText);
      if (result.detectedLanguage) {
        setDetectedLanguage(result.detectedLanguage);
      }
      if (result.confidence !== undefined) {
        setConfidence(result.confidence);
      }
      setAlternatives(result.alternativeTranslations || []);
      setFromMemory(!!result.fromTranslationMemory);
      
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
  }, [inputText, sourceLanguage, targetLanguage, domain, formalityLevel, useTranslationMemory, isTranslating]);
  
  // We'll use the more advanced translate function with options
  const translate = translateWithOptions;
  
  const batchTranslate = useCallback(async (texts: string[]) => {
    if (!texts.length || isTranslating) return null;
    
    setIsTranslating(true);
    
    try {
      const batchResult = await batchTranslateTexts(
        texts,
        targetLanguage,
        sourceLanguage,
        {
          domain,
          formalityLevel,
          useTranslationMemory
        }
      );
      
      toast({
        title: "Batch Translation Started",
        description: `Translating ${texts.length} items. This may take a moment.`,
      });
      
      // Poll for results
      const checkStatus = async () => {
        const status = getBatchTranslationStatus(batchResult.id);
        
        if (status.status === 'completed' && status.results) {
          toast({
            title: "Batch Translation Complete",
            description: `Successfully translated ${status.results.length} items.`,
          });
          return status.results.map(r => r.translatedText);
        } else if (status.status === 'failed') {
          throw new Error(status.error || 'Batch translation failed');
        } else {
          // Still processing, wait and check again
          await new Promise(resolve => setTimeout(resolve, 500));
          return checkStatus();
        }
      };
      
      return await checkStatus();
    } catch (error) {
      console.error('Batch translation error:', error);
      toast({
        title: "Batch Translation Failed",
        description: error instanceof Error ? error.message : "An error occurred during batch translation.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, [sourceLanguage, targetLanguage, domain, formalityLevel, useTranslationMemory, isTranslating]);
  
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
  
  const handleUpdateDomainSettings = useCallback((newSettings: {
    domain?: UseTranslationOptions['domain'],
    formalityLevel?: UseTranslationOptions['formalityLevel'],
    useTranslationMemory?: boolean
  }) => {
    if (newSettings.domain !== undefined) {
      setDomain(newSettings.domain);
    }
    
    if (newSettings.formalityLevel !== undefined) {
      setFormalityLevel(newSettings.formalityLevel);
    }
    
    if (newSettings.useTranslationMemory !== undefined) {
      setUseTranslationMemory(newSettings.useTranslationMemory);
    }
    
    toast({
      title: "Translation Settings Updated",
      description: "Your translation settings have been updated.",
    });
  }, []);
  
  const handleSwapLanguages = useCallback(() => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(outputText);
    setOutputText('');
  }, [sourceLanguage, targetLanguage, outputText]);
  
  const handleTranslateFile = useCallback(async (file: File): Promise<string | null> => {
    if (!file) return null;
    
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
    domain,
    formalityLevel,
    useTranslationMemory,
    fromMemory,
    
    // Actions
    setInputText,
    setOutputText,
    setSourceLanguage,
    setTargetLanguage,
    translate,
    batchTranslate,
    handleSwapLanguages,
    handleClearHistory,
    handleUpdatePreferences,
    handleUpdateDomainSettings,
    handleTranslateFile,
  };
}
