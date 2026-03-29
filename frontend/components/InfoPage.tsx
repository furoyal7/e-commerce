import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface InfoPageProps {
  title: string;
  category: string;
  content: string;
  highlights?: string[];
}

export default function InfoPage({ title, category, content, highlights }: InfoPageProps) {
  return (
    <div className="flex min-h-full flex-col bg-secondary-bg selection:bg-accent selection:text-white">
      <Navbar />

      <main className="flex-1 pt-[104px] pb-16">
        <div className="mx-auto max-w-[1000px] px-4 pt-12 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-border p-8 lg:p-12">
            <span className="text-accent font-bold text-sm tracking-widest uppercase mb-4 block">
              {category}
            </span>
            <h1 className="text-4xl font-black text-primary tracking-tight mb-8">
              {title}
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                {content}
              </p>
              
              {highlights && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="h-6 w-6 rounded-full bg-accent text-white flex items-center justify-center shrink-0 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="font-semibold text-primary">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-4">
              <button className="bg-accent text-white px-8 py-3 rounded-md font-bold hover:bg-accent-light transition-all shadow-md">
                Get Started
              </button>
              <button className="bg-slate-100 text-primary px-8 py-3 rounded-md font-bold hover:bg-slate-200 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
