
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TranslationInput from '@/components/TranslationInput';
import TranslationOutput from '@/components/TranslationOutput';
import LanguageSelector from '@/components/LanguageSelector';
import { translateText } from '@/lib/translationService';
import { detectLanguage } from '@/lib/languageUtils';
import { ArrowRight, FileText, Sparkles, Volume2 as VolumeIcon } from 'lucide-react';

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [detectedLanguage, setDetectedLanguage] = useState<string | undefined>();
  const [isTranslating, setIsTranslating] = useState(false);
  
  useEffect(() => {
    // Auto-detect language when input changes
    if (inputText.trim().length > 3) {
      const detected = detectLanguage(inputText);
      setDetectedLanguage(detected);
      setSourceLanguage(detected);
    }
  }, [inputText]);
  
  const handleTranslate = async () => {
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
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };
  
  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    
    // Also swap the text content
    setInputText(outputText);
    setOutputText('');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-16">
        {/* Hero section */}
        <section className="max-w-4xl mx-auto text-center mb-12 md:mb-20 animate-fade-in">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            AI-Powered Multilingual Translation
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4 text-balance">
            Translate text <span className="text-brand-500">instantly</span> with precision
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            Break language barriers with our AI translation tool. Translate between 15+ languages with context-aware accuracy.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button className="button-animation px-6 py-3 rounded-lg bg-brand-500 text-white font-medium text-sm shadow-sm">
              Get Started
            </button>
            <button className="button-animation px-6 py-3 rounded-lg border border-border bg-white text-foreground font-medium text-sm">
              <FileText className="h-4 w-4 mr-2 inline-block" />
              Translate Documents
            </button>
          </div>
        </section>
        
        {/* Translation interface */}
        <section className="max-w-7xl mx-auto mb-16">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LanguageSelector 
                value={sourceLanguage} 
                onChange={setSourceLanguage} 
                showDetected={true}
                detectedLanguage={detectedLanguage}
              />
              
              <button 
                onClick={handleSwapLanguages}
                disabled={isTranslating}
                className="p-2 rounded-lg border hover:bg-secondary transition-colors button-animation"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <LanguageSelector 
                value={targetLanguage} 
                onChange={setTargetLanguage}
              />
            </div>
            
            <div className="text-xs text-muted-foreground">
              <button className="hover:text-brand-600 transition-colors">
                <Sparkles className="h-3.5 w-3.5 inline-block mr-1" />
                Get AI suggestions
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="translate-panel">
              <TranslationInput 
                value={inputText} 
                onChange={setInputText}
                onTranslate={handleTranslate}
                isBusy={isTranslating}
              />
            </div>
            
            <div className="translate-panel">
              <TranslationOutput 
                text={outputText}
                loading={isTranslating} 
              />
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass-panel rounded-xl p-6 flex flex-col glass-panel-hover">
            <div className="h-12 w-12 rounded-lg bg-brand-100 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">AI-Powered Accuracy</h3>
            <p className="text-muted-foreground text-sm">Context-aware translations that understand nuance and cultural references.</p>
          </div>
          
          <div className="glass-panel rounded-xl p-6 flex flex-col glass-panel-hover">
            <div className="h-12 w-12 rounded-lg bg-brand-100 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Document Translation</h3>
            <p className="text-muted-foreground text-sm">Translate entire documents, books, or research papers with formatting preserved.</p>
          </div>
          
          <div className="glass-panel rounded-xl p-6 flex flex-col glass-panel-hover">
            <div className="h-12 w-12 rounded-lg bg-brand-100 flex items-center justify-center mb-4">
              <VolumeIcon className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Audio Pronunciation</h3>
            <p className="text-muted-foreground text-sm">Listen to the correct pronunciation of translated text for better learning.</p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
