
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentTranslator from '@/components/DocumentTranslator';
import { useTranslation } from '@/hooks/useTranslation';

const Documents = () => {
  const {
    sourceLanguage,
    targetLanguage,
    handleTranslateFile,
    setSourceLanguage,
    setTargetLanguage,
  } = useTranslation({
    autoDetect: true,
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-16">
        <section className="max-w-4xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4 text-balance">
            Document Translation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            Upload and translate entire documents while preserving formatting and structure.
          </p>
        </section>
        
        <section className="max-w-2xl mx-auto mb-16">
          <DocumentTranslator
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onTranslate={handleTranslateFile}
          />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Documents;
