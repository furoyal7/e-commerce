'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useCart as useCartQuery, useAddToCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '@/hooks/use-api';
import { CartItem } from '@/lib/cart';
import { useRouter } from 'next/navigation';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(null);
  const { data: cart, isLoading: isQueryLoading } = useCartQuery();
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();
  const router = useRouter();

  // 1. Initial Load & Auth Sync
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    setToken(savedToken);
  }, []);

  // 3. User Login Sync Logic
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('accessToken');
      if (currentToken !== token) {
        setToken(currentToken);
      }
    };
    const interval = setInterval(checkToken, 1000); // Check for login/logout
    return () => clearInterval(interval);
  }, [token]);

  const cartItems = token ? (cart?.items || []) : [];

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (token) {
      await addToCartMutation.mutateAsync({ productId, quantity });
    } else {
      router.push('/login');
      throw new Error('User must be logged in');
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    if (token) {
      await updateCartItemMutation.mutateAsync({ productId, quantity });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (token) {
      await removeFromCartMutation.mutateAsync(productId);
    }
  };

  const clearCart = async () => {
    if (token) {
      await clearCartMutation.mutateAsync();
    }
  };

  const totalItems = token ? (cart?.totalItems || 0) : 0;
  const totalPrice = token ? (cart?.totalPrice || 0) : 0;

  const isLoading = token ? isQueryLoading : false;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCartItem, removeFromCart, clearCart, totalItems, totalPrice, isLoading }}>
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
