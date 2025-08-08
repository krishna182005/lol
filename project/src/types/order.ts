/**
 * Order-related TypeScript interfaces for TrustyLads e-commerce
 */

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  category: string;
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

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'razorpay' | 'cod' | 'bank_transfer' | 'wallet';

export interface Order {
  _id?: string;
  orderId: string;
  customer: Customer;
  shipping: ShippingAddress;
  items: OrderItem[];
  
  // Payment details
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  
  // Order status
  orderStatus: OrderStatus;
  trackingId?: string;
  courierPartner?: string;
  
  // Pricing
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount?: number;
  couponCode?: string;
  total: number;
  
  // Delivery
  estimatedDelivery?: string;
  actualDelivery?: string;
  
  // Metadata
  statusHistory: OrderStatusHistory[];
  notes?: string;
  adminNotes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  itemsCount: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
}

export interface CreateOrderRequest {
  customer: Customer;
  shipping: ShippingAddress;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  couponCode?: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  trackingId?: string;
  courierPartner?: string;
  note?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  search?: string; // Search by order ID, customer email, or phone
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  todayOrders: number;
  todayRevenue: number;
  monthlyRevenue: number;
  monthlyOrders: number;
}

// Razorpay specific interfaces
export interface RazorpayOrderRequest {
  amount: number; // Amount in paise
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  orderId: string;
}

// Tracking interfaces
export interface TrackingInfo {
  trackingId: string;
  courierPartner: string;
  status: string;
  location?: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
  updates: TrackingUpdate[];
}

export interface TrackingUpdate {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

// Return/Refund interfaces
export interface ReturnRequest {
  orderId: string;
  items: {
    productId: string;
    quantity: number;
    reason: string;
  }[];
  reason: string;
  description?: string;
  images?: string[];
}

export interface RefundRequest {
  orderId: string;
  amount: number;
  reason: string;
  refundMethod: 'original' | 'wallet' | 'bank_transfer';
}

// Email notification interfaces
export interface OrderEmailData {
  order: Order;
  customer: Customer;
  items: OrderItem[];
  trackingUrl?: string;
}

export interface EmailTemplate {
  subject: string;
  template: string;
  data: OrderEmailData;
}

// Coupon interfaces
export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface CouponValidationResult {
  isValid: boolean;
  discount: number;
  message: string;
  coupon?: Coupon;
}

export default Order;