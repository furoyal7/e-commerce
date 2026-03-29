'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogin } from '../../hooks/use-api';
import { Lock, Mail, Loader2, AlertCircle, ChevronRight, Globe } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid business email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorStatus(null);
    try {
      await loginMutation.mutateAsync(data);
      // Redirect to admin after successful login
      window.location.href = '/admin';
    } catch (err: any) {
      setErrorStatus(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10 group">
        <div className="flex h-10 w-10 items-center justify-center rounded bg-[#131921] text-white font-black text-xl italic transition-transform group-hover:scale-110">
          A
        </div>
        <span className="text-2xl font-black tracking-tighter uppercase italic leading-none text-[#131921]">
          AMAZON<span className="text-[#f08804]">X</span>
        </span>
      </Link>

      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="p-10 pb-6">
            <h1 className="text-3xl font-black text-[#131921] tracking-tight mb-2 uppercase italic">
              Sign-In
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Access Technical Control Center
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-10 pt-4 space-y-6">
            {errorStatus && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-[11px] font-bold uppercase tracking-wider leading-tight">{errorStatus}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#f08804] transition-colors" />
                <input 
                  {...register('email')} 
                  type="email" 
                  placeholder="name@company.com" 
                  className={`w-full bg-slate-50 border ${errors.email ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none`} 
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1 pr-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                <Link href="#" className="text-[10px] font-black text-[#f08804] uppercase hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#f08804] transition-colors" />
                <input 
                  {...register('password')} 
                  type="password" 
                  placeholder="••••••••" 
                  className={`w-full bg-slate-50 border ${errors.password ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none`} 
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{errors.password.message}</p>}
            </div>

            <button 
              disabled={loginMutation.isPending} 
              type="submit" 
              className="w-full bg-[#131921] text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-[#131921]/10 flex items-center justify-center gap-3 hover:bg-[#232f3e] hover:-translate-y-1 active:translate-y-0 disabled:opacity-70"
            >
              {loginMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Continue <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px]"><span className="bg-white px-4 font-bold text-slate-400 uppercase tracking-widest">New to AmazonX?</span></div>
            </div>

            <Link 
              href="#" 
              className="w-full border-2 border-slate-200 text-[#131921] py-4 rounded-2xl font-black uppercase tracking-widest text-center block hover:bg-slate-50 transition-all text-xs"
            >
              Create Corporate Account
            </Link>
          </form>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-6">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase hover:text-slate-600 transition-colors cursor-pointer">
              <Globe className="h-3 w-3" /> EN
            </div>
            <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
            <div className="text-[10px] font-bold text-slate-400 uppercase hover:text-slate-600 transition-colors cursor-pointer">Privacy</div>
            <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
            <div className="text-[10px] font-bold text-slate-400 uppercase hover:text-slate-600 transition-colors cursor-pointer">Terms</div>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-wide px-4">
          By signing in, you agree to AmazonX's Conditions of Use and Privacy Notice.
        </p>
      </div>
    </div>
  );
}
