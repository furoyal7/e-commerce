'use client';

import React from 'react';
import { ShieldCheck, Globe, Cpu, Zap, Mail, Phone, MapPin, ChevronUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-light text-white overflow-hidden">
      {/* Back to Top Bar */}
      <button 
        onClick={scrollToTop}
        className="w-full bg-primary-slate py-4 text-[13px] font-medium hover:bg-[#485769] transition-colors flex items-center justify-center gap-2"
      >
        <ChevronUp className="h-4 w-4" /> Back to top
      </button>

      {/* Primary Footer Section */}
      <div className="mx-auto max-w-[1400px] px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand & Mission */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-accent text-white font-black text-lg italic shadow-lg shadow-accent/10">
                A
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic leading-none">
                AMAZON<span className="text-accent">X</span>
              </span>
            </div>
            <p className="max-w-xs text-[12px] leading-relaxed text-white/60">
              The international destination for technical inventory, precision instrumentation, and global enterprise solutions. Built on trust, delivered with speed.
            </p>
            <div className="flex items-center gap-4 text-white/40">
              {[ShieldCheck, Globe, Cpu, Zap].map((Icon, i) => (
                <Icon key={i} className="h-5 w-5 hover:text-accent transition-colors cursor-pointer" />
              ))}
            </div>
          </div>

          {/* Navigation Modules */}
          {[
            {
              title: 'GET TO KNOW US',
              links: [
                { name: 'Careers', href: '/careers' },
                { name: 'Blog', href: '/blog' },
                { name: 'About AmazonX', href: '/about' },
                { name: 'Investor Relations', href: '/investors' },
                { name: 'Devices', href: '/devices' },
                { name: 'Science', href: '/science' }
              ]
            },
            {
              title: 'MAKE MONEY WITH US',
              links: [
                { name: 'Sell on AmazonX', href: '/sell' },
                { name: 'Sell Business', href: '/sell-business' },
                { name: 'Apps on AmazonX', href: '/apps' },
                { name: 'Become an Affiliate', href: '/affiliate' },
                { name: 'Self-Publish', href: '/publish' },
                { name: 'Host Hub', href: '/host' }
              ]
            },
            {
              title: 'PAYMENT PRODUCTS',
              links: [
                { name: 'Business Card', href: '/business-card' },
                { name: 'Shop with Points', href: '/points' },
                { name: 'Reload Your Balance', href: '/reload' },
                { name: 'Currency Converter', href: '/currency' },
                { name: 'Gift Cards', href: '/gift-cards' }
              ]
            }
          ].map((section) => (
            <div key={section.title}>
              <h4 className="mb-6 text-[11px] font-black tracking-widest text-white uppercase">{section.title}</h4>
              <ul className="flex flex-col gap-2.5 text-[13px] text-white/70">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:underline hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Lower Footer Section - Global Navy */}
      <div className="bg-primary border-t border-white/5 py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 border-b border-white/5 pb-12 sm:flex-row">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 border border-white/20 rounded-sm px-3 py-1.5 cursor-pointer hover:border-white/40">
                    <Globe className="h-4 w-4 opacity-70" />
                    <span className="text-[12px]">English</span>
                </div>
                <div className="flex items-center gap-2 border border-white/20 rounded-sm px-3 py-1.5 cursor-pointer hover:border-white/40">
                    <span className="text-[11px] opacity-70">$</span>
                    <span className="text-[12px]">USD - U.S. Dollar</span>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" className="h-3 shadow-sm" alt="US Flag" />
                <span className="text-[12px] opacity-70">United States</span>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[11px] text-white/50">
              {['Conditions of Use', 'Privacy Notice', 'Consumer Health Data Privacy', 'Your Ads Privacy Choices'].map((link) => (
                <a key={link} href="#" className="hover:underline">{link}</a>
              ))}
            </div>
            <p className="text-[11px] text-white/30 uppercase tracking-widest">
              © 2026, AmazonX.tech, Inc. or its affiliates
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
