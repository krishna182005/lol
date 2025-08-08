export interface Product {
  _id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'shirts' | 'watches' | 'jewelry';
  subcategory?: string;
  sizes: ProductSize[];
  totalStock: number;
  images: ProductImage[];
  description: string;
  specifications: Specification[];
  featured: boolean;
  isActive: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSize {
  size: string;
  stock: number;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface Specification {
  key: string;
  value: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  category: string;
  maxStock: number;
}

export interface Customer {
  email: string;
  phone: string;
  name: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface Order {
  _id?: string;
  orderId: string;
  customer: Customer;
  shipping: ShippingAddress;
  items: CartItem[];
  paymentMethod: 'razorpay' | 'cod' | 'bank_transfer';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingId?: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  estimatedDelivery?: string;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistory {
  status: string;
  timestamp: string;
  note?: string;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CheckoutData {
  customer: Customer;
  shipping: ShippingAddress;
  paymentMethod: 'razorpay' | 'cod' | 'bank_transfer';
}