import api from './api';

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;

    price: number;
    currency: string;
    stock: number;
    images: string[];
  };
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  currency: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export const cartApi = {
  getCart: (): Promise<Cart> =>
    api.get('cart').then(res => res.data),

  addToCart: (data: AddToCartData): Promise<CartItem> =>
    api.post('cart', data).then(res => res.data),

  updateCartItem: (productId: string, quantity: number): Promise<CartItem> =>
    api.patch(`cart/${productId}`, { quantity }).then(res => res.data),

  removeFromCart: (productId: string): Promise<void> =>
    api.delete(`cart/${productId}`),

  clearCart: (): Promise<void> =>
    api.delete('cart'),

  validateCart: (): Promise<{ isValid: boolean; unavailableItems: any[] }> =>
    api.get('cart/validate').then(res => res.data),
};
