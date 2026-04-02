'use client';

import React from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartItem, totalItems, totalPrice, isLoading } = useCart() as any;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#f08804] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-xl mx-auto bg-white rounded-[32px] p-12 text-center shadow-xl shadow-slate-200 border border-slate-100">
          <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-10 w-10 text-slate-300" />
          </div>
          <h1 className="text-3xl font-black text-[#131921] uppercase italic tracking-tight mb-4">Your Cart is Empty</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-10">Start building your technical inventory today</p>
          <Link href="/products" className="inline-flex items-center justify-center px-10 py-5 bg-[#131921] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#232f3e] transition-all hover:-translate-y-1 shadow-xl shadow-slate-200">
            Browse Products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-black text-[#131921] uppercase italic tracking-tighter">Shopping Cart</h1>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{totalItems} Items Total</span>
            </div>

            {cartItems.map((item: any) => (
              <div key={item.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-all">
                <div className="h-32 w-32 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product.image || item.product.images?.[0] || 'https://via.placeholder.com/150'} 
                    alt={item.product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-[#131921] uppercase italic truncate mb-1">{item.product.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">SKU: {item.product.slug}</p>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100 p-1">
                      <button 
                        onClick={() => updateCartItem(item.productId, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:text-[#f08804] text-slate-400 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-black text-[#131921] text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartItem(item.productId, Math.min(item.product.stock, item.quantity + 1))}
                        className="p-2 hover:text-[#f08804] text-slate-400 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-[#131921] italic">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${item.product.price} / Unit</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-[#131921] rounded-[32px] p-10 text-white shadow-2xl shadow-[#131921]/20 sticky top-10">
              <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-widest">Subtotal</span>
                  <span className="font-bold font-mono">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-widest">Shipping</span>
                  <span className="font-bold text-[10px] uppercase tracking-widest text-[#f08804]">FREE</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f08804]">Total Amount</span>
                  <span className="text-3xl font-black italic tracking-tighter">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" className="w-full bg-[#f08804] text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#e07b03] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#f08804]/20">
                Proceed to Secure Checkout <ArrowRight className="h-5 w-5" />
              </Link>

              <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale invert">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
