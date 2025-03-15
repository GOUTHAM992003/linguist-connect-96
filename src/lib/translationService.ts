import { detectLanguage } from './languageUtils';

// This is a mock translation service for demo purposes
// In a real application, you would call an actual translation API

interface TranslationRequest {
  text: string;
  sourceLanguage?: string;
  targetLanguage: string;
}

interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
  alternativeTranslations?: string[];
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
const generateFakeTranslation = (text: string, targetLang: string): string => {
  // Check if we have a predefined translation
  if (demoTranslations[text]?.[targetLang]) {
    return demoTranslations[text][targetLang];
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

export async function translateText(
  request: TranslationRequest
): Promise<TranslationResponse> {
  const { text, sourceLanguage, targetLanguage } = request;
  
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
  
  // Simulate API delay - more realistic with variable timing
  await delay(500 + Math.random() * 800);
  
  // Generate fake translation
  const translatedText = generateFakeTranslation(text, targetLanguage);
  
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
