'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useCart as useCartQuery, useAddToCart, useRemoveFromCart, useClearCart } from '@/hooks/use-api';
import { CartItem } from '@/lib/cart';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: cart, isLoading } = useCartQuery();
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const cartItems = cart?.items || [];

  const addToCart = async (productId: string, quantity: number = 1) => {
    await addToCartMutation.mutateAsync({ productId, quantity });
  };

  const removeFromCart = async (productId: string) => {
    await removeFromCartMutation.mutateAsync(productId);
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  const totalItems = cart?.totalItems || 0;
  const totalPrice = cart?.totalPrice || 0;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalItems, totalPrice, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
