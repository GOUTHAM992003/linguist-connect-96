
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
  if (['zh', 'ja', 'ko', 'ar', 'hi', 'bn'].includes(targetLang)) {
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
  };
  
  return modifications[targetLang] ? modifications[targetLang](text) : text;
};

// Simulated delay to mimic API call
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function translateText(
  request: TranslationRequest
): Promise<TranslationResponse> {
  const { text, sourceLanguage, targetLanguage } = request;
  
  // Return early if no text or source and target languages are the same
  if (!text.trim() || (sourceLanguage && sourceLanguage === targetLanguage)) {
    return {
      translatedText: text,
      detectedLanguage: sourceLanguage,
    };
  }
  
  // Detect language if not provided
  const detectedLanguage = sourceLanguage || detectLanguage(text);
  
  // Simulate API delay
  await delay(500 + Math.random() * 800);
  
  // Generate fake translation
  const translatedText = generateFakeTranslation(text, targetLanguage);
  
  return {
    translatedText,
    detectedLanguage,
  };
}
