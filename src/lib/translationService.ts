import { detectLanguage } from './languageUtils';
import { translationMemory, applyDomainSpecificTranslation } from './domainTranslationService';

// This is a mock translation service for demo purposes
// In a real application, you would call an actual translation API

interface TranslationRequest {
  text: string;
  sourceLanguage?: string;
  targetLanguage: string;
  domain?: 'general' | 'technical' | 'medical' | 'legal' | 'financial' | 'academic';
  formalityLevel?: 'formal' | 'neutral' | 'informal';
  useTranslationMemory?: boolean;
  glossary?: Record<string, string>;
}

interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
  alternativeTranslations?: string[];
  fromTranslationMemory?: boolean;
}

// Demo translations for various phrases
const demoTranslations: Record<string, Record<string, string>> = {
  'Hello, world!': {
    es: '¡Hola, mundo!',
    fr: 'Bonjour, monde!',
    de: 'Hallo, Welt!',
    it: 'Ciao, mondo!',
    pt: 'Olá, mundo!',
    ru: 'Привет, мир!',
    zh: '你好，世界！',
    ja: 'こんにちは、世界！',
    ko: '안녕하세요, 세계!',
    ar: 'مرحبا بالعالم!',
    hi: 'नमस्ते, दुनिया!',
    bn: 'হ্যালো, বিশ্ব!',
    tr: 'Merhaba, dünya!',
    pl: 'Witaj, świecie!',
    te: 'హలో, ప్రపంచం!',
  },
  'How are you today?': {
    es: '¿Cómo estás hoy?',
    fr: 'Comment allez-vous aujourd\'hui?',
    de: 'Wie geht es dir heute?',
    it: 'Come stai oggi?',
    pt: 'Como você está hoje?',
    ru: 'Как дела сегодня?',
    zh: '今天你好吗？',
    ja: '今日の調子はどうですか？',
    ko: '오늘 어떻게 지내세요?',
    ar: 'كيف حالك اليوم؟',
    hi: 'आज आप कैसे हैं?',
    bn: 'আপনি আজ কেমন আছেন?',
    tr: 'Bugün nasılsın?',
    pl: 'Jak się masz dzisiaj?',
    te: 'మీరు ఈరోజు ఎలా ఉన్నారు?',
  },
};

// Function to generate a fake translation
const generateFakeTranslation = (text: string, targetLang: string, domain?: string, formalityLevel?: string): string => {
  // Check if we have a predefined translation
  if (demoTranslations[text]?.[targetLang]) {
    let translation = demoTranslations[text][targetLang];
    
    // Apply formality adjustments (simple mock)
    if (formalityLevel === 'formal' && targetLang === 'es') {
      translation = translation.replace(/¡Hola/g, '¡Saludos');
    } else if (formalityLevel === 'informal' && targetLang === 'es') {
      translation = translation.replace(/¡Hola/g, '¡Qué tal');
    }
    
    // Apply domain-specific terminology (simple mock)
    if (domain && domain !== 'general') {
      translation = `[${domain}] ${translation}`;
    }
    
    return translation;
  }
  
  // If not, create a fake translation by:
  // 1. For non-Latin script languages, append a message
  if (['zh', 'ja', 'ko', 'ar', 'hi', 'bn', 'te'].includes(targetLang)) {
    return `[${targetLang.toUpperCase()}] ${text} (Translation would appear here in ${targetLang})`;
  }
  
  // 2. For Latin script languages, modify the text slightly
  const modifications: Record<string, (text: string) => string> = {
    es: (t) => `${t} (en español)`,
    fr: (t) => `${t} (en français)`,
    de: (t) => `${t} (auf Deutsch)`,
    it: (t) => `${t} (in italiano)`,
    pt: (t) => `${t} (em português)`,
    ru: (t) => `${t} (на русском)`,
    tr: (t) => `${t} (Türkçe olarak)`,
    pl: (t) => `${t} (po polsku)`,
    te: (t) => `${t} (తెలుగులో)`,
  };
  
  return modifications[targetLang] ? modifications[targetLang](text) : text;
};

// Simulated delay to mimic API call
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock translation history
const translationHistory: {
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}[] = [];

// Mock user preferences - would come from a database in a real backend
const userPreferences = {
  defaultSourceLanguage: 'en',
  defaultTargetLanguage: 'es',
  formalityLevel: 'neutral', // neutral, formal, informal
  saveHistory: true,
  autoDetect: true,
};

// Mock batch translation queue
const batchTranslationQueue: {
  id: string;
  request: TranslationRequest;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: TranslationResponse;
  error?: string;
  timestamp: number;
}[] = [];

export async function translateText(
  request: TranslationRequest
): Promise<TranslationResponse> {
  const { text, sourceLanguage, targetLanguage, domain, formalityLevel, useTranslationMemory, glossary } = request;
  
  // Return early if no text or source and target languages are the same
  if (!text.trim() || (sourceLanguage && sourceLanguage === targetLanguage)) {
    return {
      translatedText: text,
      detectedLanguage: sourceLanguage,
      confidence: 1.0,
    };
  }
  
  // Detect language if not provided
  const detectedLanguage = sourceLanguage || detectLanguage(text);
  
  // Check translation memory if enabled
  if (useTranslationMemory !== false) {
    const memoryEntry = translationMemory.find(text, detectedLanguage, targetLanguage, domain);
    
    if (memoryEntry) {
      console.log('Translation found in memory:', memoryEntry);
      return {
        translatedText: memoryEntry.targetText,
        detectedLanguage,
        confidence: 0.95, // High confidence for memory matches
        fromTranslationMemory: true,
      };
    }
  }
  
  // Simulate API delay - more realistic with variable timing
  await delay(500 + Math.random() * 800);
  
  // Generate fake translation
  let translatedText = generateFakeTranslation(text, targetLanguage, domain, formalityLevel);
  
  // Apply domain-specific translation adjustments if a domain is specified
  if (domain && domain !== 'general') {
    translatedText = applyDomainSpecificTranslation(
      translatedText,
      detectedLanguage,
      targetLanguage,
      {
        domain: domain,
        formalityLevel: formalityLevel || 'neutral',
        glossary
      }
    );
  }
  
  // Save to history - in a real app this would go to a database
  if (userPreferences.saveHistory) {
    translationHistory.push({
      sourceText: text,
      targetText: translatedText,
      sourceLanguage: detectedLanguage,
      targetLanguage,
      timestamp: Date.now(),
    });
    
    // Keep history at a reasonable size (simulating storage constraints)
    if (translationHistory.length > 100) {
      translationHistory.shift();
    }
  }
  
  // Add to translation memory if enabled
  if (useTranslationMemory !== false) {
    translationMemory.add({
      sourceText: text,
      sourceLanguage: detectedLanguage,
      targetText: translatedText,
      targetLanguage,
      domain,
    });
  }
  
  // Create a more realistic response
  const response: TranslationResponse = {
    translatedText,
    detectedLanguage,
    confidence: 0.8 + Math.random() * 0.2, // Simulate a confidence score
  };
  
  // Sometimes provide alternative translations
  if (Math.random() > 0.7) {
    response.alternativeTranslations = [
      translatedText + " (alternative 1)",
      translatedText + " (alternative 2)",
    ];
  }
  
  return response;
}

// Get translation history - in a real app this would fetch from a database
export function getTranslationHistory() {
  return [...translationHistory];
}

// Clear translation history
export function clearTranslationHistory() {
  translationHistory.length = 0;
  return { success: true };
}

// Update user preferences - in a real app this would save to a database
export function updateUserPreferences(newPreferences: Partial<typeof userPreferences>) {
  Object.assign(userPreferences, newPreferences);
  return { ...userPreferences };
}

// Get user preferences
export function getUserPreferences() {
  return { ...userPreferences };
}

// Batch translate multiple texts
export async function batchTranslateTexts(
  texts: string[],
  targetLanguage: string,
  sourceLanguage?: string,
  options?: Omit<TranslationRequest, 'text' | 'sourceLanguage' | 'targetLanguage'>
): Promise<{
  id: string;
  status: 'pending';
}> {
  // Generate a unique ID for this batch
  const batchId = `batch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Queue the batch
  batchTranslationQueue.push({
    id: batchId,
    request: {
      text: texts.join('\n---\n'), // We'll split later
      sourceLanguage,
      targetLanguage,
      ...options
    },
    status: 'pending',
    timestamp: Date.now()
  });
  
  // Process batch in background (in a real app, this would be a server-side job)
  setTimeout(() => processBatchTranslation(batchId), 100);
  
  return {
    id: batchId,
    status: 'pending'
  };
}

// Check batch translation status
export function getBatchTranslationStatus(batchId: string): {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results?: TranslationResponse[];
  error?: string;
} {
  const batch = batchTranslationQueue.find(b => b.id === batchId);
  
  if (!batch) {
    return {
      id: batchId,
      status: 'failed',
      error: 'Batch not found'
    };
  }
  
  if (batch.status === 'completed' && batch.result) {
    // Split the result back into individual texts
    const translatedTexts = batch.result.translatedText.split('\n---\n');
    
    return {
      id: batchId,
      status: 'completed',
      results: translatedTexts.map(text => ({
        translatedText: text,
        detectedLanguage: batch.result?.detectedLanguage,
        confidence: batch.result?.confidence,
        fromTranslationMemory: batch.result?.fromTranslationMemory
      }))
    };
  }
  
  return {
    id: batchId,
    status: batch.status,
    error: batch.error
  };
}

// Process a batch translation (internal function)
async function processBatchTranslation(batchId: string): Promise<void> {
  const batchIndex = batchTranslationQueue.findIndex(b => b.id === batchId);
  if (batchIndex === -1) return;
  
  const batch = batchTranslationQueue[batchIndex];
  batch.status = 'processing';
  
  try {
    // Split the text into individual items
    const texts = batch.request.text.split('\n---\n');
    
    // Process each text individually
    const results = await Promise.all(
      texts.map(text => 
        translateText({
          ...batch.request,
          text
        })
      )
    );
    
    // Combine results
    batch.result = {
      translatedText: results.map(r => r.translatedText).join('\n---\n'),
      detectedLanguage: results[0]?.detectedLanguage,
      confidence: results.reduce((sum, r) => sum + (r.confidence || 0), 0) / results.length
    };
    
    batch.status = 'completed';
  } catch (error) {
    console.error('Batch translation error:', error);
    batch.status = 'failed';
    batch.error = error instanceof Error ? error.message : 'Unknown error';
  }
  
  // In a real app, we would clean up old batches periodically
  // Here we'll just keep the last 20
  if (batchTranslationQueue.length > 20) {
    batchTranslationQueue.sort((a, b) => b.timestamp - a.timestamp);
    batchTranslationQueue.length = 20;
  }
}

// Handle document translation - mock implementation
export async function translateDocument(file: File, targetLanguage: string): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  // In a real implementation, this would:
  // 1. Upload the file to a server
  // 2. Process it with a translation service
  // 3. Return a URL to the translated document
  
  // Simulate processing time based on file size
  const processingTime = file.size / 1024 * 10; // 10ms per KB
  await delay(Math.min(processingTime, 5000)); // Cap at 5 seconds
  
  // Simulate success/failure
  if (Math.random() > 0.1) { // 90% success rate
    return {
      success: true,
      url: `https://example.com/translated-${file.name}`,
    };
  } else {
    return {
      success: false,
      error: "Error processing document. Please try again.",
    };
  }
}
