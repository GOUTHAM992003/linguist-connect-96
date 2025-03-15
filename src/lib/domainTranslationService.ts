
// Domain-specific translation services for specialized content

type DomainType = 'general' | 'technical' | 'medical' | 'legal' | 'financial' | 'academic';

interface DomainTranslationOptions {
  domain: DomainType;
  formalityLevel?: 'formal' | 'neutral' | 'informal';
  glossary?: Record<string, string>; // Custom terminology
}

// Domain-specific terminology examples (would be more extensive in a real implementation)
const domainGlossaries: Record<DomainType, Record<string, Record<string, string>>> = {
  general: {},
  technical: {
    en: {
      'API': 'Application Programming Interface',
      'UI': 'User Interface',
      'database': 'database',
      'algorithm': 'algorithm',
      'framework': 'framework'
    },
    es: {
      'API': 'Interfaz de Programación de Aplicaciones',
      'UI': 'Interfaz de Usuario',
      'database': 'base de datos',
      'algorithm': 'algoritmo',
      'framework': 'marco de trabajo'
    },
    te: {
      'API': 'అప్లికేషన్ ప్రోగ్రామింగ్ ఇంటర్ఫేస్',
      'UI': 'యూజర్ ఇంటర్ఫేస్',
      'database': 'డేటాబేస్',
      'algorithm': 'అల్గారిథమ్',
      'framework': 'ఫ్రేమ్‌వర్క్'
    }
  },
  medical: {
    en: {
      'diagnosis': 'diagnosis',
      'treatment': 'treatment',
      'symptom': 'symptom',
      'prognosis': 'prognosis'
    },
    es: {
      'diagnosis': 'diagnóstico',
      'treatment': 'tratamiento',
      'symptom': 'síntoma',
      'prognosis': 'pronóstico'
    },
    te: {
      'diagnosis': 'రోగనిర్ధారణ',
      'treatment': 'చికిత్స',
      'symptom': 'లక్షణం',
      'prognosis': 'వ్యాధి నిర్ణయం'
    }
  },
  legal: {
    en: {
      'contract': 'contract',
      'statute': 'statute',
      'plaintiff': 'plaintiff',
      'defendant': 'defendant',
      'jurisdiction': 'jurisdiction'
    },
    es: {
      'contract': 'contrato',
      'statute': 'estatuto',
      'plaintiff': 'demandante',
      'defendant': 'demandado',
      'jurisdiction': 'jurisdicción'
    },
    te: {
      'contract': 'ఒప్పందం',
      'statute': 'చట్టం',
      'plaintiff': 'వాది',
      'defendant': 'ప్రతివాది',
      'jurisdiction': 'అధికారపరిధి'
    }
  },
  financial: {
    en: {
      'asset': 'asset',
      'liability': 'liability',
      'equity': 'equity',
      'dividend': 'dividend',
      'portfolio': 'portfolio'
    },
    es: {
      'asset': 'activo',
      'liability': 'pasivo',
      'equity': 'capital',
      'dividend': 'dividendo',
      'portfolio': 'cartera'
    },
    te: {
      'asset': 'ఆస్తి',
      'liability': 'అప్పు',
      'equity': 'ఈక్విటీ',
      'dividend': 'డివిడెండ్',
      'portfolio': 'పోర్ట్‌ఫోలియో'
    }
  },
  academic: {
    en: {
      'thesis': 'thesis',
      'methodology': 'methodology',
      'analysis': 'analysis',
      'citation': 'citation',
      'abstract': 'abstract'
    },
    es: {
      'thesis': 'tesis',
      'methodology': 'metodología',
      'analysis': 'análisis',
      'citation': 'citación',
      'abstract': 'resumen'
    },
    te: {
      'thesis': 'సిద్ధాంతం',
      'methodology': 'పద్ధతి',
      'analysis': 'విశ్లేషణ',
      'citation': 'ఉల్లేఖనం',
      'abstract': 'సారాంశం'
    }
  }
};

/**
 * Enhances a translation by applying domain-specific terminology and style
 */
export function applyDomainSpecificTranslation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  options: DomainTranslationOptions
): string {
  // Get domain-specific glossary
  const domainGlossary = domainGlossaries[options.domain] || domainGlossaries.general;
  const customGlossary = options.glossary || {};
  
  // Apply custom terminology if present in the target language
  let enhancedText = text;
  
  // Apply glossary terms (would be more sophisticated in a real implementation)
  if (domainGlossary[sourceLanguage] && domainGlossary[targetLanguage]) {
    const sourceTerms = Object.keys(domainGlossary[sourceLanguage]);
    
    for (const term of sourceTerms) {
      // Simple term replacement (a real implementation would be more context-aware)
      const sourceTerm = domainGlossary[sourceLanguage][term];
      const targetTerm = domainGlossary[targetLanguage][term];
      
      if (sourceTerm && targetTerm) {
        const regex = new RegExp(`\\b${sourceTerm}\\b`, 'gi');
        enhancedText = enhancedText.replace(regex, targetTerm);
      }
    }
  }
  
  // Apply custom glossary if provided
  for (const [key, value] of Object.entries(customGlossary)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    enhancedText = enhancedText.replace(regex, value);
  }
  
  // Apply formality adjustments based on language and domain
  // (simplified implementation - would be more sophisticated in production)
  if (options.formalityLevel === 'formal') {
    if (targetLanguage === 'es') {
      // For Spanish, use more formal pronouns and conjugations
      enhancedText = enhancedText
        .replace(/\btú\b/g, 'usted')
        .replace(/\bvosotros\b/g, 'ustedes');
    } else if (targetLanguage === 'de') {
      // For German, capitalize the formal "Sie"
      enhancedText = enhancedText.replace(/\bsie\b/g, 'Sie');
    }
  }
  
  return enhancedText;
}

/**
 * Handles batch translation of multiple texts
 */
export async function batchTranslate(
  texts: string[],
  sourceLanguage: string,
  targetLanguage: string,
  options?: DomainTranslationOptions
): Promise<string[]> {
  // In a real implementation, this would batch API calls efficiently
  // For our mock implementation, we'll just simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  // Mock translations (in a real app, this would call the actual translation service)
  return texts.map(text => {
    // Create a simple mock translation by adding a prefix
    const mockTranslation = `[${targetLanguage}] ${text}`;
    
    // Apply domain-specific enhancements if options provided
    if (options) {
      return applyDomainSpecificTranslation(
        mockTranslation,
        sourceLanguage,
        targetLanguage,
        options
      );
    }
    
    return mockTranslation;
  });
}

// Translation memory to improve repeated translations
type TranslationMemoryEntry = {
  sourceText: string;
  sourceLanguage: string;
  targetText: string;
  targetLanguage: string;
  domain?: DomainType;
  lastUsed: number;
};

class TranslationMemory {
  private memory: TranslationMemoryEntry[] = [];
  private readonly MEMORY_LIMIT = 1000; // Maximum entries to store
  
  // Add a translation to memory
  add(entry: Omit<TranslationMemoryEntry, 'lastUsed'>): void {
    // Check if the translation already exists
    const existingIndex = this.memory.findIndex(
      item => 
        item.sourceText === entry.sourceText && 
        item.sourceLanguage === entry.sourceLanguage &&
        item.targetLanguage === entry.targetLanguage
    );
    
    if (existingIndex >= 0) {
      // Update existing entry and move it to front (most recently used)
      this.memory[existingIndex] = {
        ...entry,
        lastUsed: Date.now()
      };
    } else {
      // Add new entry
      this.memory.unshift({
        ...entry,
        lastUsed: Date.now()
      });
      
      // Trim memory if it exceeds the limit
      if (this.memory.length > this.MEMORY_LIMIT) {
        this.memory.sort((a, b) => b.lastUsed - a.lastUsed); // Sort by recency
        this.memory = this.memory.slice(0, this.MEMORY_LIMIT);
      }
    }
  }
  
  // Find a translation in memory
  find(sourceText: string, sourceLanguage: string, targetLanguage: string, domain?: DomainType): TranslationMemoryEntry | null {
    const entry = this.memory.find(
      item => 
        item.sourceText === sourceText && 
        item.sourceLanguage === sourceLanguage &&
        item.targetLanguage === targetLanguage &&
        (!domain || !item.domain || item.domain === domain)
    );
    
    if (entry) {
      // Update the last used timestamp
      entry.lastUsed = Date.now();
      return entry;
    }
    
    return null;
  }
  
  // Clear entries older than the specified time
  clearOlderThan(timestamp: number): void {
    this.memory = this.memory.filter(entry => entry.lastUsed >= timestamp);
  }
  
  // Get all entries for a specific language pair
  getEntriesForLanguagePair(sourceLanguage: string, targetLanguage: string): TranslationMemoryEntry[] {
    return this.memory.filter(
      entry => entry.sourceLanguage === sourceLanguage && entry.targetLanguage === targetLanguage
    );
  }
}

// Singleton instance of translation memory
export const translationMemory = new TranslationMemory();

export default {
  applyDomainSpecificTranslation,
  batchTranslate,
  translationMemory
};
