// ============================================================
// DESHI MOSLAR RANNAGHAR — Frontend Types
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  avatar?: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  image?: string;
  icon?: string;
  parentId?: string;
  parent?: { id: string; name: string; slug: string } | null;
  children?: Category[];
  _count?: { products: number };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  sku: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  weight?: string;
  size?: string;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  primaryImage?: string;
  images?: ProductImage[];
  avgRating: number;
  reviewCount: number;
  availableStock: number;
  category: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; slug: string };
  description?: string;
  ingredients?: string;
  usage?: string;
  storageInfo?: string;
  origin?: string;
  tags?: string[];
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  couponDiscount: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  estimatedDelivery?: string;
  items: OrderItem[];
  address: Address;
}

export interface OrderItem {
  id: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  slug: string;
  coverImage?: string;
  description?: string;
  preparationTime?: number;
  cookingTime?: number;
  servingSize?: number;
  category?: string;
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
  product?: Product;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  createdAt: string;
  user: { name: string; avatar?: string };
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_DELIVERY';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED';

export type PaymentMethod =
  | 'CASH_ON_DELIVERY'
  | 'BKASH'
  | 'NAGAD'
  | 'ROCKET'
  | 'UPAY'
  | 'MOBILE_BANKING'
  | 'INTERNET_BANKING'
  | 'BANK_TRANSFER'
  | 'VISA'
  | 'MASTERCARD'
  | 'AMEX'
  | 'DEBIT_CARD'
  | 'CREDIT_CARD'
  | 'SSLCOMMERZ';

export type PaymentStatus =
  'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
