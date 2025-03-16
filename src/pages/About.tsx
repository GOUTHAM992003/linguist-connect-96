
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Globe, Sparkles, BookOpen, FileText, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-16">
        <section className="max-w-4xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            About LinguistConnect
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4 text-balance">
            Breaking language barriers with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            Our mission is to make communication seamless across languages and cultures through advanced AI-powered translation.
          </p>
        </section>
        
        <section className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                LinguistConnect was founded with a simple yet powerful vision: to eliminate language barriers in a globally connected world. 
                Our team of language enthusiasts and AI engineers came together to create a translation platform that understands context, 
                nuance, and cultural subtleties.
              </p>
              <p className="text-muted-foreground mb-6">
                Today, we serve millions of users across the globe, helping businesses expand internationally, researchers collaborate across 
                borders, and individuals connect with people from different linguistic backgrounds.
              </p>
              <Button onClick={() => navigate('/')} className="bg-brand-500 hover:bg-brand-600">
                Try It Now
              </Button>
            </div>
            <div className="bg-gradient-to-tr from-brand-100 to-brand-50 p-8 rounded-2xl">
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-brand-500 flex items-center justify-center mt-1">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">AI-Powered Translation</h3>
                    <p className="text-sm text-muted-foreground">Advanced neural networks that understand context and nuance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-brand-500 flex items-center justify-center mt-1">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Document Translation</h3>
                    <p className="text-sm text-muted-foreground">Preserve formatting while translating entire documents.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-brand-500 flex items-center justify-center mt-1">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Specialized Domains</h3>
                    <p className="text-sm text-muted-foreground">Industry-specific translations for medical, legal, and technical fields.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-bold mb-8">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Emma Lee", role: "CEO & Founder", avatar: "👩‍💼" },
              { name: "Marcus Chen", role: "CTO", avatar: "👨‍💻" },
              { name: "Sofia Rodriguez", role: "Lead Linguist", avatar: "👩‍🔬" },
              { name: "James Wilson", role: "AI Research Lead", avatar: "👨‍🔬" }
            ].map((member, index) => (
              <div key={index} className="bg-card rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">{member.avatar}</div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
