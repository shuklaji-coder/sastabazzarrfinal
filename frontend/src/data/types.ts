export interface Product {
  id: string | number;
  name?: string;
  title?: string;
  description: string;
  brand?: string;
  price?: number;
  originalPrice?: number;
  discountedPrice?: number;
  sellingPrice?: number;
  mrpPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  rating: number;
  reviewCount: number;
  seller: Seller;
  quantity: number;
  stock?: number;
  tags: string[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
  isVerified: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  image: string;
}

export interface CartItem {
  id?: number | string;
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  address: Address;
  paymentMethod: string;
  trackingTimeline: TrackingEvent[];
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'placed' | 
  'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'PLACED';

export interface TrackingEvent {
  status: string;
  date: string;
  description: string;
  isCompleted: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  avatar: string;
}

export interface AnalyticsData {
  label: string;
  value: number;
}
