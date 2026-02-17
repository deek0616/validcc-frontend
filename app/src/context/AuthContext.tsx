import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Order, Notification, Deposit, Card } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  orders: Order[];
  notifications: Notification[];
  users: User[];
  deposits: Deposit[];
  cards: Card[];
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string, whatsapp: string) => boolean;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addOrder: (order: Order) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notification: Notification) => void;
  sendNotificationToUser: (userId: string, notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  refreshData: () => void;
  // Admin functions
  getAllUsers: () => User[];
  removeUser: (userId: string) => void;
  updateUserBalance: (userId: string, amount: number) => void;
  addDeposit: (deposit: Deposit) => void;
  approveDeposit: (depositId: string) => void;
  rejectDeposit: (depositId: string) => void;
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  getAdminStats: () => { totalUsers: number; totalCards: number; soldCards: number; totalRevenue: number; pendingDeposits: number; todayOrders: number };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_EMAIL = 'admin@validcc.shop';
const ADMIN_PASSWORD = 'admin123';

// Storage keys
const STORAGE_KEYS = {
  USER: 'validcc_user',
  USERS: 'validcc_users',
  ORDERS: 'validcc_orders',
  NOTIFICATIONS: 'validcc_notifications',
  DEPOSITS: 'validcc_deposits',
  CARDS: 'validcc_cards',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  // Load all data from localStorage
  const loadAllData = useCallback(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const savedDeposits = localStorage.getItem(STORAGE_KEYS.DEPOSITS);
      const savedCards = localStorage.getItem(STORAGE_KEYS.CARDS);

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedUsers) setUsers(JSON.parse(savedUsers));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
      if (savedDeposits) setDeposits(JSON.parse(savedDeposits));
      if (savedCards) setCards(JSON.parse(savedCards));

      // Initialize default data if not exists
      if (!savedUsers) {
        initializeDefaultData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadAllData();

    // Set up storage event listener for cross-tab updates
    const handleStorageChange = (e: StorageEvent) => {
      if (Object.values(STORAGE_KEYS).includes(e.key || '')) {
        loadAllData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadAllData]);

  const initializeDefaultData = () => {
    // Create default admin
    const adminUser: User = {
      id: 'admin_1',
      username: 'admin',
      email: ADMIN_EMAIL,
      whatsapp: '+1234567890',
      password: ADMIN_PASSWORD,
      balance: 0,
      vipTier: 'diamond',
      totalPurchases: 0,
      joinedAt: new Date().toISOString(),
      referralCode: 'ADMIN001',
      isAdmin: true,
      deposits: [],
    };

    // Generate initial cards
    const initialCards = generateInitialCards();

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser]));
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(initialCards));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));

    setUsers([adminUser]);
    setCards(initialCards);
    setOrders([]);
    setDeposits([]);
    setNotifications([]);
  };

  const generateInitialCards = (): Card[] => {
    const cards: Card[] = [];
    const types: ('visa' | 'mastercard' | 'amex')[] = ['visa', 'mastercard', 'amex'];
    const categories: ('standard' | 'gold' | 'platinum')[] = ['standard', 'gold', 'platinum'];
    
    for (let i = 0; i < 100; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const balance = Math.floor(Math.random() * 9500) + 500;
      const price = Math.floor(balance * (0.02 + Math.random() * 0.02));
      
      const cardNumber = Array(4).fill(0).map(() => 
        Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      ).join(' ');
      
      const month = Math.floor(Math.random() * 12) + 1;
      const year = 25 + Math.floor(Math.random() * 5);
      
      cards.push({
        id: `card_${Date.now()}_${i}`,
        type,
        number: cardNumber,
        last4: cardNumber.split(' ')[3],
        expiry: `${month.toString().padStart(2, '0')}/${year}`,
        cvv: Math.floor(Math.random() * 900 + 100).toString(),
        holderName: `Card Holder ${i + 1}`,
        balance,
        price,
        category,
        status: 'active',
        addedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    return cards.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
  };

  const generateReferralCode = () => {
    return 'VC' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Refresh all data from localStorage
  const refreshData = useCallback(() => {
    loadAllData();
  }, [loadAllData]);

  const login = (email: string, password: string): boolean => {
    const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const foundUser = allUsers.find((u: User) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string, whatsapp: string): boolean => {
    const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    if (allUsers.find((u: User) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: 'user_' + Date.now(),
      username,
      email,
      whatsapp,
      password,
      balance: 0,
      vipTier: 'bronze',
      totalPurchases: 0,
      joinedAt: new Date().toISOString(),
      referralCode: generateReferralCode(),
      isAdmin: false,
      deposits: [],
    };

    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setUsers(updatedUsers);
    setUser(newUser);

    // Add notification for new user
    const welcomeNotification: Notification = {
      id: 'notif_' + Date.now(),
      type: 'system',
      title: 'Welcome to ValidCC!',
      message: 'Your account has been created successfully. Deposit USDT to start shopping!',
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    const updatedNotifications = [welcomeNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const updatedUsers = allUsers.map((u: User) => 
        u.id === user.id ? updatedUser : u
      );
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  const addOrder = (order: Order) => {
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

    // Mark card as sold
    const allCards = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARDS) || '[]');
    const updatedCards = allCards.map((c: Card) => 
      c.id === order.cardId 
        ? { ...c, status: 'sold' as const, soldTo: order.userId, soldAt: new Date().toISOString() }
        : c
    );
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updatedCards));
    setCards(updatedCards);

    if (user) {
      const updatedUser = { 
        ...user, 
        totalPurchases: user.totalPurchases + order.price,
        balance: user.balance - order.price
      };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const updatedUsers = allUsers.map((u: User) => 
        u.id === user.id ? updatedUser : u
      );
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }

    const purchaseNotification: Notification = {
      id: 'notif_' + Date.now(),
      type: 'purchase',
      title: 'Purchase Successful!',
      message: `You purchased a ${order.card.type.toUpperCase()} card ending in ${order.card.last4} for $${order.price}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    const updatedNotifications = [purchaseNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
  };

  const markNotificationRead = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
  };

  const addNotification = (notification: Notification) => {
    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
  };

  // Send notification to specific user
  const sendNotificationToUser = (userId: string, notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: 'notif_' + Date.now() + '_' + userId,
      createdAt: new Date().toISOString(),
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
  };

  // Admin Functions
  const getAllUsers = () => users.filter(u => !u.isAdmin);

  const removeUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  };

  const updateUserBalance = (userId: string, amount: number) => {
    const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const updatedUsers = allUsers.map((u: User) => {
      if (u.id === userId) {
        return { ...u, balance: Math.max(0, u.balance + amount) };
      }
      return u;
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Update current user if it's the same
    if (user && user.id === userId) {
      const updatedUser = updatedUsers.find((u: User) => u.id === userId);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
    }

    // Send notification to user
    const actionType = amount >= 0 ? 'added' : 'removed';
    sendNotificationToUser(userId, {
      type: 'balance',
      title: 'Balance Updated',
      message: `$${Math.abs(amount)} has been ${actionType} to your account by admin.`,
      read: false,
    });
  };

  const addDeposit = (deposit: Deposit) => {
    const updatedDeposits = [deposit, ...deposits];
    setDeposits(updatedDeposits);
    localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(updatedDeposits));

    // Add to user's deposits
    const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const updatedUsers = allUsers.map((u: User) => {
      if (u.id === deposit.userId) {
        return { ...u, deposits: [...(u.deposits || []), deposit] };
      }
      return u;
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const approveDeposit = (depositId: string) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit) return;

    const updatedDeposits = deposits.map(d => 
      d.id === depositId 
        ? { ...d, status: 'approved' as const, processedAt: new Date().toISOString() }
        : d
    );
    setDeposits(updatedDeposits);
    localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(updatedDeposits));

    // Add balance to user
    const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const updatedUsers = allUsers.map((u: User) => {
      if (u.id === deposit.userId) {
        return { 
          ...u, 
          balance: u.balance + deposit.amount,
          deposits: u.deposits?.map((d: Deposit) => 
            d.id === depositId 
              ? { ...d, status: 'approved' as const, processedAt: new Date().toISOString() }
              : d
          ) || []
        };
      }
      return u;
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Update current user if it's the same
    if (user && user.id === deposit.userId) {
      const updatedUser = updatedUsers.find((u: User) => u.id === deposit.userId);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
    }

    // Send notification to user
    sendNotificationToUser(deposit.userId, {
      type: 'deposit',
      title: 'Deposit Approved!',
      message: `Your deposit of $${deposit.amount} has been approved and added to your balance.`,
      read: false,
    });
  };

  const rejectDeposit = (depositId: string) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit) return;

    const updatedDeposits = deposits.map(d => 
      d.id === depositId 
        ? { ...d, status: 'rejected' as const, processedAt: new Date().toISOString() }
        : d
    );
    setDeposits(updatedDeposits);
    localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(updatedDeposits));

    // Update user's deposits
    const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const updatedUsers = allUsers.map((u: User) => {
      if (u.id === deposit.userId) {
        return { 
          ...u, 
          deposits: u.deposits?.map((d: Deposit) => 
            d.id === depositId 
              ? { ...d, status: 'rejected' as const, processedAt: new Date().toISOString() }
              : d
          ) || []
        };
      }
      return u;
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Send notification to user
    sendNotificationToUser(deposit.userId, {
      type: 'deposit',
      title: 'Deposit Rejected',
      message: `Your deposit of $${deposit.amount} has been rejected. Please contact support.`,
      read: false,
    });
  };

  const addCard = (card: Card) => {
    const updatedCards = [card, ...cards];
    setCards(updatedCards);
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updatedCards));
  };

  const removeCard = (cardId: string) => {
    const updatedCards = cards.filter(c => c.id !== cardId);
    setCards(updatedCards);
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updatedCards));
  };

  const updateCard = (cardId: string, updates: Partial<Card>) => {
    const updatedCards = cards.map(c => 
      c.id === cardId ? { ...c, ...updates } : c
    );
    setCards(updatedCards);
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updatedCards));
  };

  const getAdminStats = () => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.purchasedAt).toDateString() === today).length;
    
    return {
      totalUsers: users.filter(u => !u.isAdmin).length,
      totalCards: cards.filter(c => c.status === 'active').length,
      soldCards: cards.filter(c => c.status === 'sold').length,
      totalRevenue: orders.reduce((sum, o) => sum + o.price, 0),
      pendingDeposits: deposits.filter(d => d.status === 'pending').length,
      todayOrders,
    };
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false,
      orders,
      notifications,
      users,
      deposits,
      cards,
      login,
      register,
      logout,
      updateBalance,
      addOrder,
      markNotificationRead,
      addNotification,
      sendNotificationToUser,
      refreshData,
      getAllUsers,
      removeUser,
      updateUserBalance,
      addDeposit,
      approveDeposit,
      rejectDeposit,
      addCard,
      removeCard,
      updateCard,
      getAdminStats,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
