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

// File types that can be translated
export const supportedFileTypes = [
  { extension: 'txt', mimeType: 'text/plain', name: 'Text Document' },
  { extension: 'pdf', mimeType: 'application/pdf', name: 'PDF Document' },
  { extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', name: 'Word Document' },
  { extension: 'html', mimeType: 'text/html', name: 'HTML Document' },
  { extension: 'json', mimeType: 'application/json', name: 'JSON File' },
  { extension: 'md', mimeType: 'text/markdown', name: 'Markdown Document' },
];

// Check if a file is supported for translation
export const isFileSupported = (file: File): boolean => {
  return supportedFileTypes.some(type => 
    file.type === type.mimeType || file.name.endsWith(`.${type.extension}`)
  );
};

// Get estimated word count from file size (very rough estimation)
export const estimateWordCount = (fileSize: number): number => {
  // Rough estimate: 1KB = ~170 words for plain text
  return Math.round(fileSize / 1024 * 170);
};

// Format languages for display in UI
export const formatLanguagePair = (source: string, target: string): string => {
  const sourceLang = getLanguageByCode(source);
  const targetLang = getLanguageByCode(target);
  return `${sourceLang.flag} ${sourceLang.name} → ${targetLang.flag} ${targetLang.name}`;
};

// Get translation difficulty estimation (purely for UI demonstration)
export const getTranslationDifficulty = (source: string, target: string): 'easy' | 'medium' | 'hard' => {
  // Languages with similar roots are easier to translate between
  const europeanLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'pl'];
  const asianLanguages = ['zh', 'ja', 'ko'];
  const indianLanguages = ['hi', 'bn', 'te'];
  
  // Same language family is easy
  if (
    (europeanLanguages.includes(source) && europeanLanguages.includes(target)) ||
    (asianLanguages.includes(source) && asianLanguages.includes(target)) ||
    (indianLanguages.includes(source) && indianLanguages.includes(target))
  ) {
    return 'easy';
  }
  
  // European to/from Indian is medium
  if (
    (europeanLanguages.includes(source) && indianLanguages.includes(target)) ||
    (indianLanguages.includes(source) && europeanLanguages.includes(target))
  ) {
    return 'medium';
  }
  
  // Everything else is hard (especially with different writing systems)
  return 'hard';
};
