'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { apiClient } from '@/utils/api-client';
import { Loader2, Tag, Percent } from 'lucide-react';

export default function DealsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);
        const data = await apiClient.get<any>('/products', { 
          params: { onSale: 'true', status: 'published' } 
        });
        setProducts(data.products || []);
      } catch (err: any) {
        console.error('Error fetching deals:', err);
        setError(err.message || 'Failed to load deals.');
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, []);

  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-black uppercase tracking-widest mb-4">
              <Percent className="h-4 w-4" /> Limited Time Offers
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-[#0f1111] uppercase italic">
              Today's <span className="text-accent underline decoration-4 underline-offset-8">Hot Deals</span>
            </h1>
            <p className="mt-4 text-[14px] text-[#555] font-medium max-w-2xl mx-auto">
              Exclusive professional gear and industrial equipment at liquidation prices. New inventory deployments every 24 hours.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-accent" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Scanning for price drops...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center">
              <p className="text-red-600 font-bold uppercase tracking-widest text-xs">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6 bg-white rounded-3xl border border-border shadow-sm">
              <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                <Tag className="h-10 w-10 text-slate-300" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-black text-[#0f1111] uppercase tracking-tight">No Active Deals</h2>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">All specialized inventory is currently at standard deployment rates.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={Number(product.price)}
                  image={product.image || product.images?.[0]}
                  categories={product.categories}
                  rating={4}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
