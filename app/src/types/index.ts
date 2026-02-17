export interface User {
  id: string;
  username: string;
  email: string;
  whatsapp: string;
  password: string;
  balance: number;
  vipTier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  totalPurchases: number;
  joinedAt: string;
  referralCode: string;
  isAdmin?: boolean;
  deposits: Deposit[];
}

export interface Deposit {
  id: string;
  userId: string;
  amount: number;
  txHash: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
}

export interface Card {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  number: string;
  last4: string;
  expiry: string;
  cvv: string;
  holderName: string;
  balance: number;
  price: number;
  category: 'standard' | 'gold' | 'platinum';
  status: 'active' | 'sold';
  addedAt: string;
  soldTo?: string;
  soldAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  cardId: string;
  card: Card;
  price: number;
  purchasedAt: string;
}

export interface Notification {
  id: string;
  type: 'purchase' | 'balance' | 'system' | 'promo' | 'security' | 'deposit';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface VIPTier {
  name: string;
  minPurchases: number;
  discount: number;
  refundWindow: number;
  benefits: string[];
}

export interface FilterOptions {
  type: 'all' | 'visa' | 'mastercard' | 'amex';
  balanceRange: 'all' | 'starter' | 'standard' | 'premium' | 'elite';
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'balance-high';
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalCards: number;
  soldCards: number;
  totalRevenue: number;
  pendingDeposits: number;
  todayOrders: number;
}
