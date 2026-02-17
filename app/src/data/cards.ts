import type { Card, Testimonial } from '@/types';

export const generateCards = (): Card[] => {
  const cards: Card[] = [];
  const types: ('visa' | 'mastercard' | 'amex')[] = ['visa', 'mastercard', 'amex'];
  const categories: ('standard' | 'gold' | 'platinum')[] = ['standard', 'gold', 'platinum'];
  
  for (let i = 0; i < 500; i++) {
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
      id: `card_${i}`,
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

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    location: 'New York, USA',
    avatar: 'SM',
    rating: 5,
    text: 'The instant delivery and accurate balances make ValidCC my only choice for testing payment gateways. Absolutely reliable service!',
  },
  {
    id: '2',
    name: 'Michael Chen',
    location: 'London, UK',
    avatar: 'MC',
    rating: 5,
    text: 'I have processed over 200 purchases here, and every single card worked perfectly as described. Outstanding platform!',
  },
  {
    id: '3',
    name: 'Jessica Wong',
    location: 'Toronto, Canada',
    avatar: 'JW',
    rating: 5,
    text: 'The $5,000 starting balance let me test the service thoroughly before adding my own funds - now I am a lifetime customer.',
  },
  {
    id: '4',
    name: 'David Kumar',
    location: 'Mumbai, India',
    avatar: 'DK',
    rating: 5,
    text: 'Best card marketplace I have ever used. Clean interface, instant delivery, and excellent customer support. Highly recommended!',
  },
  {
    id: '5',
    name: 'Emma Rodriguez',
    location: 'Sydney, Australia',
    avatar: 'ER',
    rating: 5,
    text: 'The VIP tiers are amazing. As a Gold member, I get early access to high-balance cards and exclusive discounts.',
  },
  {
    id: '6',
    name: 'Ahmed Hassan',
    location: 'Dubai, UAE',
    avatar: 'AH',
    rating: 5,
    text: 'Professional service with transparent pricing. The referral program helped me earn over $2,000 in bonuses. Thank you ValidCC!',
  },
];

export const vipTiers = [
  {
    name: 'Bronze',
    minPurchases: 0,
    discount: 0,
    refundWindow: 24,
    benefits: ['Standard pricing', '24-hour refund window', 'Email support'],
  },
  {
    name: 'Silver',
    minPurchases: 1000,
    discount: 3,
    refundWindow: 36,
    benefits: ['3% discount on all cards', '36-hour refund window', 'Priority email support'],
  },
  {
    name: 'Gold',
    minPurchases: 5000,
    discount: 5,
    refundWindow: 48,
    benefits: ['5% discount on all cards', '48-hour refund window', 'Priority support line', 'Early inventory access'],
  },
  {
    name: 'Platinum',
    minPurchases: 20000,
    discount: 8,
    refundWindow: 72,
    benefits: ['8% discount on all cards', '72-hour refund window', 'Dedicated account manager', '2-hour early access'],
  },
  {
    name: 'Diamond',
    minPurchases: 50000,
    discount: 12,
    refundWindow: 168,
    benefits: ['12% discount on all cards', '7-day refund window', 'Personal account manager', 'Exclusive high-balance cards'],
  },
];

export const features = [
  {
    icon: 'Zap',
    title: 'Instant Delivery',
    description: 'Receive complete card details within seconds of purchase. No waiting, no delays.',
  },
  {
    icon: 'Shield',
    title: 'Secure Wallet',
    description: 'Bank-grade encryption protects your funds and transaction history.',
  },
  {
    icon: 'Search',
    title: 'Advanced Filters',
    description: 'Find specific card types, balance ranges, or price points effortlessly.',
  },
  {
    icon: 'Bell',
    title: 'Real-time Notifications',
    description: 'Stay updated on order status, new inventory, and exclusive offers.',
  },
  {
    icon: 'Globe',
    title: 'Multi-language Support',
    description: 'Catering to our global customer base with localized experience.',
  },
  {
    icon: 'Smartphone',
    title: 'Responsive Design',
    description: 'Perfect functionality across desktop, tablet, and mobile devices.',
  },
];

export const howItWorks = [
  {
    step: 1,
    title: 'Create Account',
    description: 'Sign up in less than 2 minutes. No verification delays or complex procedures.',
  },
  {
    step: 2,
    title: 'Get $5,000 Bonus',
    description: 'Starting balance is automatically credited to your account upon registration.',
  },
  {
    step: 3,
    title: 'Browse & Select',
    description: 'Explore 500+ verified cards with advanced filtering and search options.',
  },
  {
    step: 4,
    title: 'Instant Purchase',
    description: 'Click purchase, balance is deducted, and full card details are revealed immediately.',
  },
];

export const stats = [
  { value: '50,000+', label: 'Active Customers' },
  { value: '120', label: 'Countries Served' },
  { value: '99.9%', label: 'Satisfaction Rate' },
  { value: '$2M+', label: 'Monthly Volume' },
];
