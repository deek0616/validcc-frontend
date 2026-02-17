import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  User, Package, Wallet, Gift, Crown, Copy, Check, 
  CreditCard, Calendar, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { vipTiers } from '@/data/cards';
import { useToast } from '@/hooks/use-toast';

export function Profile() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { user, orders, deposits } = useAuth();
  const { toast } = useToast();
  const [copiedCard, setCopiedCard] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Please login to view your profile.</p>
      </div>
    );
  }

  const handleCopyCard = (cardId: string, cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber);
    setCopiedCard(cardId);
    toast({
      title: 'Copied!',
      description: 'Card number copied to clipboard.',
    });
    setTimeout(() => setCopiedCard(null), 2000);
  };

  const nextTier = vipTiers.find(t => t.minPurchases > user.totalPurchases);
  const progressToNext = nextTier 
    ? Math.min(100, (user.totalPurchases / nextTier.minPurchases) * 100)
    : 100;

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return <span className="text-blue-400 font-bold text-xs">VISA</span>;
      case 'mastercard':
        return <span className="text-orange-400 font-bold text-xs">MC</span>;
      case 'amex':
        return <span className="text-cyan-400 font-bold text-xs">AMEX</span>;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const userDeposits = deposits.filter(d => d.userId === user.id);
  const userOrders = orders.filter(o => o.userId === user.id);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">
          My <span className="text-gradient-gold">Profile</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your account, view orders, and track your VIP progress.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="vip">VIP Status</TabsTrigger>
          <TabsTrigger value="referral">Referral</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* User Info Card */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center text-black">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-semibold">{user.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center text-black">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-semibold text-gold">${user.balance.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center text-black">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="font-semibold">{userOrders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center text-black">
                    <Crown className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">VIP Tier</p>
                    <p className="font-semibold capitalize">{user.vipTier}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Details */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
                  <p className="font-medium">{user.whatsapp}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                  <p className="font-medium">{new Date(user.joinedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Referral Code</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-surface px-3 py-1 rounded text-sm">{user.referralCode}</code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(user.referralCode);
                        toast({ title: 'Copied!' });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          {userOrders.length === 0 ? (
            <Card className="border-border/40">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't made any purchases yet. Start shopping to see your orders here.
                </p>
                <Button className="btn-primary" onClick={() => window.location.href = '/shop'}>
                  Browse Cards
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {userOrders.map((order) => (
                <Card key={order.id} className="border-border/40">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                          {getCardIcon(order.card.type)}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {order.card.type.toUpperCase()} Card ending in {order.card.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Order ID: {order.id} • {new Date(order.purchasedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-semibold">${order.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Balance</p>
                          <p className="font-semibold text-gold">${order.card.balance.toLocaleString()}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyCard(order.id, order.card.number)}
                        >
                          {copiedCard === order.id ? (
                            <Check className="h-4 w-4 mr-1" />
                          ) : (
                            <Copy className="h-4 w-4 mr-1" />
                          )}
                          Copy Card
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/40 grid gap-2 md:grid-cols-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Card Number: </span>
                        <span className="font-mono">{order.card.number}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expiry: </span>
                        <span className="font-mono">{order.card.expiry}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">CVV: </span>
                        <span className="font-mono">{order.card.cvv}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Deposits Tab */}
        <TabsContent value="deposits" className="space-y-6">
          {userDeposits.length === 0 ? (
            <Card className="border-border/40">
              <CardContent className="p-12 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Deposits Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't made any deposits yet. Deposit USDT to start shopping.
                </p>
                <Button className="btn-primary" onClick={() => window.location.href = '/deposit'}>
                  Make Deposit
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {userDeposits.map((deposit) => (
                <Card key={deposit.id} className="border-border/40">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-gold" />
                        </div>
                        <div>
                          <p className="font-semibold text-gold">${deposit.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(deposit.createdAt).toLocaleDateString()}
                          </p>
                          <code className="text-xs text-muted-foreground">
                            Tx: {deposit.txHash.slice(0, 20)}...
                          </code>
                        </div>
                      </div>
                      
                      <div>
                        <Badge 
                          variant={deposit.status === 'approved' ? 'default' : deposit.status === 'rejected' ? 'destructive' : 'outline'}
                          className={deposit.status === 'approved' ? 'bg-green-500' : ''}
                        >
                          {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* VIP Status Tab */}
        <TabsContent value="vip" className="space-y-6">
          <Card className="border-gold/30 bg-gradient-to-br from-surface to-surface-light">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-gold flex items-center justify-center text-black">
                  <Crown className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Tier</p>
                  <p className="text-2xl font-bold capitalize">{user.vipTier} Member</p>
                </div>
              </div>
              
              {nextTier && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress to {nextTier.name}</span>
                    <span>{progressToNext.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gold transition-all duration-500"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Spend ${(nextTier.minPurchases - user.totalPurchases).toLocaleString()} more to reach {nextTier.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vipTiers.map((tier) => (
              <Card 
                key={tier.name} 
                className={`border-border/40 ${tier.name.toLowerCase() === user.vipTier ? 'border-gold/50 bg-gold/5' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    {tier.name.toLowerCase() === user.vipTier && (
                      <Badge className="bg-gold text-black">Current</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-gold" />
                      <span className="font-semibold">{tier.discount}% Discount</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gold" />
                      <span className="font-semibold">{tier.refundWindow}h Refund Window</span>
                    </div>
                    <div className="pt-4 border-t border-border/40">
                      <p className="text-sm text-muted-foreground mb-2">Benefits:</p>
                      <ul className="space-y-1">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <Check className="h-3 w-3 text-success" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Referral Tab */}
        <TabsContent value="referral" className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="h-5 w-5 text-gold" />
                Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold mb-2">Earn $500 Per Referral</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Share your unique referral code with friends. When they sign up, 
                  both of you receive $500 bonus credit instantly!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <code className="bg-surface px-6 py-3 rounded-lg text-lg font-mono">
                  {user.referralCode}
                </code>
                <Button 
                  className="btn-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Join ValidCC with my referral code: ${user.referralCode} and get $500 bonus!`
                    );
                    toast({ title: 'Referral link copied!' });
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3 pt-6">
                <div className="text-center p-4 rounded-lg bg-surface">
                  <p className="text-2xl font-bold text-gold">$500</p>
                  <p className="text-sm text-muted-foreground">Per Referral</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-surface">
                  <p className="text-2xl font-bold text-gold">5%</p>
                  <p className="text-sm text-muted-foreground">Discount at 5 Referrals</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-surface">
                  <p className="text-2xl font-bold text-gold">Priority</p>
                  <p className="text-sm text-muted-foreground">Support at 10 Referrals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
