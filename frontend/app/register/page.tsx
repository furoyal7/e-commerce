'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRegister } from '../../hooks/use-api';
import { Lock, Mail, Loader2, AlertCircle, ChevronRight, User, Briefcase } from 'lucide-react';
import Link from 'next/link';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid business email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema) as any,
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorStatus(null);
    try {
      await registerMutation.mutateAsync(data);
      // Redirect to login after successful registration
      window.location.href = '/login?registered=true';
    } catch (err: any) {
      setErrorStatus(err.response?.data?.message || 'Registration failed. System error.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <Link href="/" className="flex items-center gap-2 mb-10 group">
        <div className="flex h-10 w-10 items-center justify-center rounded bg-[#131921] text-white font-black text-xl italic transition-transform group-hover:scale-110">
          A
        </div>
        <span className="text-2xl font-black tracking-tighter uppercase italic leading-none text-[#131921]">
          AMAZON<span className="text-[#f08804]">X</span>
        </span>
      </Link>

      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="p-10 pb-6 text-center">
            <h1 className="text-3xl font-black text-[#131921] tracking-tight mb-2 uppercase italic">
              Create Account
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Join the Global Technical Network
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-10 pt-4 space-y-5">
            {errorStatus && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-[11px] font-bold uppercase tracking-wider leading-tight">{errorStatus}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">First Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#f08804] transition-colors" />
                  <input {...register('firstName')} placeholder="John" className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none`} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
                <input {...register('lastName')} placeholder="Doe" className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none`} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Business Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#f08804] transition-colors" />
                <input {...register('email')} type="email" placeholder="name@company.com" className={`w-full bg-slate-50 border ${errors.email ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none`} />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#f08804] transition-colors" />
                <input {...register('password')} type="password" placeholder="••••••••" className={`w-full bg-slate-50 border ${errors.password ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#f08804] focus:bg-white transition-all outline-none`} />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest pl-1 italic">Passwords must be at least 6 characters.</p>
            </div>

            <button 
              disabled={registerMutation.isPending} 
              type="submit" 
              className="w-full bg-[#131921] text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-[#131921]/10 flex items-center justify-center gap-3 hover:bg-[#232f3e] hover:-translate-y-1 active:translate-y-0 disabled:opacity-70"
            >
              {registerMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px]"><span className="bg-white px-4 font-bold text-slate-400 uppercase tracking-widest">Already have an account?</span></div>
            </div>

            <Link 
              href="/login" 
              className="w-full border-2 border-slate-200 text-[#131921] py-4 rounded-2xl font-black uppercase tracking-widest text-center block hover:bg-slate-50 transition-all text-xs"
            >
              Sign-In
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
