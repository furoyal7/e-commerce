import api from './api';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };

}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  totalPrice: number;
  currency: string;
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateOrderData {
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  redirectUrl?: string;
}

export interface ProcessPaymentData {
  orderId: string;
  paymentMethod: 'stripe' | 'paypal' | 'mock';
  paymentToken?: string;
}

export const ordersApi = {
  getOrders: (): Promise<Order[]> =>
    api.get('orders').then(res => res.data),

  getOrder: (id: string): Promise<Order> =>
    api.get(`orders/${id}`).then(res => res.data),

  createOrder: (data: CreateOrderData): Promise<Order> =>
    api.post('orders', data).then(res => res.data),

  cancelOrder: (id: string): Promise<{ message: string }> =>
    api.post(`orders/${id}/cancel`).then(res => res.data),
};

export const paymentsApi = {
  processPayment: (data: ProcessPaymentData): Promise<PaymentResponse> =>
    api.post('payments/process', data).then(res => res.data),

  getPaymentMethods: (): Promise<any[]> =>
    api.get('payments/methods').then(res => res.data),

  refundPayment: (orderId: string): Promise<PaymentResponse> =>
    api.post(`payments/${orderId}/refund`).then(res => res.data),
};
