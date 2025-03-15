
// Available languages for translation
export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
];

// Helper to get language by code
export const getLanguageByCode = (code: string) => {
  return languages.find(lang => lang.code === code) || languages[0];
};

// Simple language detection (mock implementation)
export const detectLanguage = (text: string): string => {
  // This is a mock implementation - in production, you would use a real language detection API
  if (!text || text.trim().length < 3) return 'en';
  
  // Very basic detection based on character analysis
  const hasAsianChars = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(text);
  if (hasAsianChars) {
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
    if (/[\u4e00-\u9faf\u3400-\u4dbf]/.test(text)) return 'zh';
    if (/[\uac00-\ud7af]/.test(text)) return 'ko';
  }
  
  const hasArabicChars = /[\u0600-\u06ff]/.test(text);
  if (hasArabicChars) return 'ar';
  
  const hasCyrillicChars = /[\u0400-\u04ff]/.test(text);
  if (hasCyrillicChars) return 'ru';
  
  // For Telugu
  const hasTeluguChars = /[\u0C00-\u0C7F]/.test(text);
  if (hasTeluguChars) return 'te';
  
  // For European languages, we'll use a simplistic approach based on common characters
  if (/[áéíóúüñ]/.test(text)) return 'es';
  if (/[àâçéèêëîïôùûü]/.test(text)) return 'fr';
  if (/[äöüß]/.test(text)) return 'de';
  if (/[àèéìòó]/.test(text)) return 'it';
  if (/[ãçõ]/.test(text)) return 'pt';
  
  // Default to English
  return 'en';
};
