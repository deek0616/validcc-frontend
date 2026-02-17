import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, CreditCard, ShoppingCart, Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Card as CardType, FilterOptions } from '@/types';

export function Shop() {
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    balanceRange: 'all',
    sortBy: 'newest',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [revealedCard, setRevealedCard] = useState<CardType | null>(null);
  const { user, isAuthenticated, cards, addOrder } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Only show active cards
  const activeCards = useMemo(() => cards.filter(c => c.status === 'active'), [cards]);

  const filteredCards = useMemo(() => {
    let result = [...activeCards];

    // Filter by type
    if (filters.type !== 'all') {
      result = result.filter(card => card.type === filters.type);
    }

    // Filter by balance range
    if (filters.balanceRange !== 'all') {
      const ranges = {
        starter: [500, 2000],
        standard: [2000, 5000],
        premium: [5000, 8000],
        elite: [8000, 10000],
      };
      const [min, max] = ranges[filters.balanceRange];
      result = result.filter(card => card.balance >= min && card.balance <= max);
    }

    // Search by last 4 digits
    if (searchQuery) {
      result = result.filter(card => card.last4.includes(searchQuery));
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'balance-high':
        result.sort((a, b) => b.balance - a.balance);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    }

    return result;
  }, [filters, searchQuery, activeCards]);

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to purchase cards.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!selectedCard || !user) return;

    if (user.balance < selectedCard.price) {
      toast({
        title: 'Insufficient Balance',
        description: 'Please deposit funds to your account.',
        variant: 'destructive',
      });
      navigate('/deposit');
      return;
    }

    const order = {
      id: `order_${Date.now()}`,
      userId: user.id,
      cardId: selectedCard.id,
      card: selectedCard,
      price: selectedCard.price,
      purchasedAt: new Date().toISOString(),
    };

    addOrder(order);
    setPurchaseDialogOpen(false);
    setRevealedCard(selectedCard);
    
    toast({
      title: 'Purchase Successful!',
      description: `You purchased a ${selectedCard.type.toUpperCase()} card for $${selectedCard.price}`,
    });
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return <span className="text-blue-400 font-bold text-sm">VISA</span>;
      case 'mastercard':
        return <span className="text-orange-400 font-bold text-sm">MC</span>;
      case 'amex':
        return <span className="text-cyan-400 font-bold text-sm">AMEX</span>;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      standard: 'bg-gray-500',
      gold: 'bg-yellow-500',
      platinum: 'bg-purple-500',
    };
    return (
      <Badge className={`${colors[category as keyof typeof colors]} text-white text-xs`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">
          Card <span className="text-gradient-gold">Shop</span>
        </h1>
        <p className="text-muted-foreground">
          Explore our premium inventory of {activeCards.length}+ verified cards updated hourly.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-border/40">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by last 4 digits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value as FilterOptions['type'] })}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Card Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="amex">Amex</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.balanceRange}
                onValueChange={(value) => setFilters({ ...filters, balanceRange: value as FilterOptions['balanceRange'] })}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Balance Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Balances</SelectItem>
                  <SelectItem value="starter">Starter ($500-$2K)</SelectItem>
                  <SelectItem value="standard">Standard ($2K-$5K)</SelectItem>
                  <SelectItem value="premium">Premium ($5K-$8K)</SelectItem>
                  <SelectItem value="elite">Elite ($8K+)</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters({ ...filters, sortBy: value as FilterOptions['sortBy'] })}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="balance-high">Balance: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCards.length} cards
        </p>
        {isAuthenticated && (
          <p className="text-sm">
            Your Balance: <span className="text-gold font-semibold">${user?.balance.toLocaleString()}</span>
          </p>
        )}
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No cards available matching your criteria.</p>
          <Button variant="outline" onClick={() => {setFilters({type: 'all', balanceRange: 'all', sortBy: 'newest'}); setSearchQuery('');}}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCards.map((card) => (
            <Card 
              key={card.id} 
              className="card-hover border-border/40 bg-surface/50 cursor-pointer group"
              onClick={() => {
                setSelectedCard(card);
                setPurchaseDialogOpen(true);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getCardIcon(card.type)}
                    {getCategoryBadge(card.category)}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Card Number</p>
                  <p className="font-mono text-lg tracking-wider">
                    **** **** **** {card.last4}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className="text-xl font-bold text-gold">${card.balance.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Expires</p>
                    <p className="font-mono">{card.expiry}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <p className="text-lg font-bold">${card.price}</p>
                  <Button size="sm" className="btn-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Purchase Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              Review your order details before confirming.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCard && (
            <div className="space-y-4">
              <div className="rounded-lg bg-surface p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getCardIcon(selectedCard.type)}
                    {getCategoryBadge(selectedCard.category)}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">Verified</span>
                  </div>
                </div>
                
                <p className="font-mono text-lg tracking-wider mb-1">
                  **** **** **** {selectedCard.last4}
                </p>
                <p className="text-sm text-muted-foreground">Expires: {selectedCard.expiry}</p>
                
                <div className="mt-4 pt-3 border-t border-border/40">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Balance</span>
                    <span className="text-xl font-bold text-gold">${selectedCard.balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold">${selectedCard.price}</span>
                </div>
                {isAuthenticated && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Your Balance</span>
                      <span>${user?.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border/40">
                      <span className="text-muted-foreground">Remaining After Purchase</span>
                      <span className={user && user.balance - selectedCard.price < 0 ? 'text-error' : 'text-success'}>
                        ${user ? (user.balance - selectedCard.price).toLocaleString() : '0'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setPurchaseDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={handlePurchase} 
              className="btn-primary w-full sm:w-auto"
              disabled={!isAuthenticated || (user && selectedCard ? user.balance < selectedCard.price : false)}
            >
              {!isAuthenticated ? 'Login to Purchase' : 
               user && selectedCard && user.balance < selectedCard.price ? 'Insufficient Balance' : 
               'Confirm Purchase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card Reveal Dialog */}
      <Dialog open={!!revealedCard} onOpenChange={() => setRevealedCard(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              Purchase Successful!
            </DialogTitle>
            <DialogDescription>
              Here are your card details. Save them securely.
            </DialogDescription>
          </DialogHeader>
          
          {revealedCard && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-br from-surface to-surface-light border border-gold/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  {getCardIcon(revealedCard.type)}
                  {getCategoryBadge(revealedCard.category)}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Card Number</p>
                    <p className="font-mono text-xl tracking-wider">{revealedCard.number}</p>
                  </div>
                  
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                      <p className="font-mono text-lg">{revealedCard.expiry}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">CVV</p>
                      <p className="font-mono text-lg">{revealedCard.cvv}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cardholder Name</p>
                    <p className="font-medium">{revealedCard.holderName}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-border/40">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Available Balance</span>
                      <span className="text-xl font-bold text-gold">${revealedCard.balance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-success/10 border border-success/30 rounded-lg p-3">
                <p className="text-sm text-success">
                  <Check className="h-4 w-4 inline mr-1" />
                  This card has been added to your order history.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setRevealedCard(null)} className="btn-primary w-full">
              Continue Shopping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
