import { Product, Category, Order, Address, AdminUser, Seller, AnalyticsData } from './types';

const sellers: Seller[] = [
  { id: 's1', name: 'TechVault', avatar: '🏪', rating: 4.8, totalSales: 12500, isVerified: true },
  { id: 's2', name: 'StyleHub', avatar: '👗', rating: 4.6, totalSales: 8900, isVerified: true },
  { id: 's3', name: 'HomeNest', avatar: '🏠', rating: 4.7, totalSales: 6700, isVerified: false },
  { id: 's4', name: 'FitGear Pro', avatar: '💪', rating: 4.9, totalSales: 15200, isVerified: true },
];

export const categories: Category[] = [
  { id: 'c1', name: 'Electronics', icon: '💻', productCount: 1240, image: 'https://images.unsplash.com/photo-1550009158-9fffc5f1df40?w=600&h=750&fit=crop&q=80' },
  { id: 'c2', name: 'Fashion', icon: '✨', productCount: 3450, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=750&fit=crop&q=80' },
  { id: 'c3', name: 'Living', icon: '🛋️', productCount: 890, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=750&fit=crop&q=80' },
  { id: 'c4', name: 'Sports', icon: '⚡', productCount: 670, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=750&fit=crop&q=80' },
  { id: 'c5', name: 'Books', icon: '📚', productCount: 2100, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=750&fit=crop&q=80' },
  { id: 'c6', name: 'Beauty', icon: '💄', productCount: 1560, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop&q=80' },
];

export const products: Product[] = [
  {
    id: 'p1', name: 'Wireless Noise-Cancelling Headphones', description: 'Premium ANC headphones with 40hr battery life, deep bass, and crystal-clear audio.',
    price: 199.99, originalPrice: 299.99, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'],
    category: 'Electronics', rating: 4.8, reviewCount: 2340, seller: sellers[0], quantity: 45, tags: ['bestseller', 'deal'], isFeatured: true,
  },
  {
    id: 'p2', name: 'Minimalist Leather Watch', description: 'Japanese movement, sapphire crystal, genuine Italian leather strap.',
    price: 149.00, originalPrice: 220.00, images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop'],
    category: 'Fashion', rating: 4.7, reviewCount: 1890, seller: sellers[1], quantity: 120, tags: ['trending'], isFeatured: true,
  },
  {
    id: 'p3', name: 'Smart Home Speaker', description: 'Voice-controlled speaker with premium sound, smart home hub built in.',
    price: 89.99, images: ['https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&h=600&fit=crop'],
    category: 'Electronics', rating: 4.5, reviewCount: 3200, seller: sellers[0], quantity: 200, tags: ['popular'], isNew: true,
  },
  {
    id: 'p4', name: 'Organic Cotton T-Shirt', description: '100% organic cotton, sustainably made, ultra-soft comfort fit.',
    price: 34.99, originalPrice: 49.99, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop'],
    category: 'Fashion', rating: 4.3, reviewCount: 890, seller: sellers[1], quantity: 500, tags: ['eco-friendly'],
  },
  {
    id: 'p5', name: 'Ceramic Plant Pot Set', description: 'Set of 3 handcrafted ceramic pots in earth tones with drainage holes.',
    price: 42.00, images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop'],
    category: 'Home & Living', rating: 4.6, reviewCount: 456, seller: sellers[2], quantity: 78, tags: ['handmade'], isNew: true,
  },
  {
    id: 'p6', name: 'Yoga Mat Premium', description: 'Extra thick non-slip yoga mat with alignment guides and carry strap.',
    price: 59.99, originalPrice: 79.99, images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop'],
    category: 'Sports', rating: 4.9, reviewCount: 1567, seller: sellers[3], quantity: 300, tags: ['bestseller'], isFeatured: true,
  },
  {
    id: 'p7', name: 'Mechanical Keyboard RGB', description: 'Hot-swappable switches, per-key RGB, aluminum frame, PBT keycaps.',
    price: 129.00, images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=600&fit=crop'],
    category: 'Electronics', rating: 4.7, reviewCount: 2100, seller: sellers[0], quantity: 55, tags: ['gaming'],
  },
  {
    id: 'p8', name: 'Running Shoes Ultra', description: 'Lightweight responsive cushioning, breathable mesh, carbon fiber plate.',
    price: 179.99, originalPrice: 249.99, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'],
    category: 'Sports', rating: 4.8, reviewCount: 3400, seller: sellers[3], quantity: 90, tags: ['deal', 'trending'], isFeatured: true,
  },
];

export const addresses: Address[] = [
  { id: 'a1', name: 'John Doe', phone: '+1 234 567 8900', street: '123 Main Street', city: 'New York', state: 'NY', zip: '10001', isDefault: true },
  { id: 'a2', name: 'John Doe', phone: '+1 234 567 8900', street: '456 Oak Avenue', city: 'Los Angeles', state: 'CA', zip: '90001', isDefault: false },
];

export const orders: Order[] = [
  {
    id: 'ORD-2024-001', items: [{ product: products[0], quantity: 1 }, { product: products[3], quantity: 2 }],
    total: 269.97, status: 'delivered', date: '2024-12-15', address: addresses[0], paymentMethod: 'Credit Card',
    trackingTimeline: [
      { status: 'Order Placed', date: '2024-12-15', description: 'Your order has been placed successfully', isCompleted: true },
      { status: 'Confirmed', date: '2024-12-15', description: 'Seller confirmed your order', isCompleted: true },
      { status: 'Shipped', date: '2024-12-17', description: 'Package picked up by courier', isCompleted: true },
      { status: 'Delivered', date: '2024-12-20', description: 'Package delivered to your address', isCompleted: true },
    ],
  },
  {
    id: 'ORD-2024-002', items: [{ product: products[7], quantity: 1 }],
    total: 179.99, status: 'shipped', date: '2024-12-28', address: addresses[0], paymentMethod: 'PayPal',
    trackingTimeline: [
      { status: 'Order Placed', date: '2024-12-28', description: 'Your order has been placed successfully', isCompleted: true },
      { status: 'Confirmed', date: '2024-12-28', description: 'Seller confirmed your order', isCompleted: true },
      { status: 'Shipped', date: '2024-12-30', description: 'Package picked up by courier', isCompleted: true },
      { status: 'Out for Delivery', date: '', description: 'Package is out for delivery', isCompleted: false },
      { status: 'Delivered', date: '', description: 'Package delivered', isCompleted: false },
    ],
  },
  {
    id: 'ORD-2024-003', items: [{ product: products[4], quantity: 1 }, { product: products[5], quantity: 1 }],
    total: 101.99, status: 'pending', date: '2025-01-02', address: addresses[1], paymentMethod: 'Credit Card',
    trackingTimeline: [
      { status: 'Order Placed', date: '2025-01-02', description: 'Your order has been placed', isCompleted: true },
      { status: 'Confirmed', date: '', description: 'Waiting for seller confirmation', isCompleted: false },
      { status: 'Shipped', date: '', description: 'Pending shipment', isCompleted: false },
      { status: 'Delivered', date: '', description: 'Pending delivery', isCompleted: false },
    ],
  },
];

export const adminUsers: AdminUser[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'buyer', status: 'active', joinedDate: '2024-03-15', avatar: '👩' },
  { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', role: 'seller', status: 'active', joinedDate: '2024-01-20', avatar: '👨' },
  { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'buyer', status: 'suspended', joinedDate: '2024-06-10', avatar: '🧑' },
  { id: 'u4', name: 'Diana Prince', email: 'diana@example.com', role: 'seller', status: 'pending', joinedDate: '2024-11-01', avatar: '👩‍💼' },
  { id: 'u5', name: 'Eve Wilson', email: 'eve@example.com', role: 'admin', status: 'active', joinedDate: '2023-09-05', avatar: '👩‍💻' },
  { id: 'u6', name: 'Frank Lee', email: 'frank@example.com', role: 'buyer', status: 'active', joinedDate: '2024-08-22', avatar: '👨‍🦱' },
];

export const salesData: AnalyticsData[] = [
  { label: 'Jan', value: 4200 }, { label: 'Feb', value: 5100 }, { label: 'Mar', value: 6800 },
  { label: 'Apr', value: 5400 }, { label: 'May', value: 7200 }, { label: 'Jun', value: 8900 },
  { label: 'Jul', value: 7600 }, { label: 'Aug', value: 9100 }, { label: 'Sep', value: 8400 },
  { label: 'Oct', value: 10200 }, { label: 'Nov', value: 11500 }, { label: 'Dec', value: 13400 },
];

export const revenueData: AnalyticsData[] = [
  { label: 'Jan', value: 12400 }, { label: 'Feb', value: 15100 }, { label: 'Mar', value: 18800 },
  { label: 'Apr', value: 14400 }, { label: 'May', value: 21200 }, { label: 'Jun', value: 24900 },
  { label: 'Jul', value: 19600 }, { label: 'Aug', value: 27100 }, { label: 'Sep', value: 23400 },
  { label: 'Oct', value: 30200 }, { label: 'Nov', value: 34500 }, { label: 'Dec', value: 41400 },
];
