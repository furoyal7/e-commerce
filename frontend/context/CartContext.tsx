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
  const [token, setToken] = React.useState<string | null>(null);
  const [localCart, setLocalCart] = React.useState<any[]>([]);
  const { data: cart, isLoading: isQueryLoading } = useCartQuery();
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  // 1. Initial Load & Auth Sync
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    setToken(savedToken);
    
    const savedCart = localStorage.getItem('guest_cart');
    if (savedCart) setLocalCart(JSON.parse(savedCart));
  }, []);

  // 2. Local Persistence
  useEffect(() => {
    if (!token) {
      localStorage.setItem('guest_cart', JSON.stringify(localCart));
    }
  }, [localCart, token]);

  // 3. User Login Sync Logic
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('accessToken');
      if (currentToken && !token) {
        setToken(currentToken);
        // Sync local cart to server
        if (localCart.length > 0) {
          console.log('Syncing guest cart to user account...');
          localCart.forEach(item => {
            addToCartMutation.mutate({ 
              productId: item.productId, 
              quantity: item.quantity 
            });
          });
          setLocalCart([]);
          localStorage.removeItem('guest_cart');
        }
      } else if (!currentToken && token) {
        setToken(null);
      }
    };

    const interval = setInterval(checkToken, 1000); // Check for login/logout
    return () => clearInterval(interval);
  }, [token, localCart]);

  const cartItems = token ? (cart?.items || []) : localCart;

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (token) {
      await addToCartMutation.mutateAsync({ productId, quantity });
    } else {
      // Guest Logic
      setLocalCart(current => {
        const existing = current.find(item => item.productId === productId);
        if (existing) {
          return current.map(item => 
            item.productId === productId 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          );
        }
        return [...current, { productId, quantity, id: `guest-${Date.now()}` }];
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (token) {
      await removeFromCartMutation.mutateAsync(productId);
    } else {
      setLocalCart(current => current.filter(item => item.productId !== productId));
    }
  };

  const clearCart = async () => {
    if (token) {
      await clearCartMutation.mutateAsync();
    } else {
      setLocalCart([]);
    }
  };

  const totalItems = token ? (cart?.totalItems || 0) : localCart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = token ? (cart?.totalPrice || 0) : 0; // Price calculation for guests could be added if product data is available

  const isLoading = token ? isQueryLoading : false;

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
