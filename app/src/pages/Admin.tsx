import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CreditCard, DollarSign, TrendingUp, Plus, Minus, 
  Trash2, Edit, Search, Check, X, Package,
  ArrowLeft, RefreshCw, Bell, MessageSquare, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { User, Card as CardType } from '@/types';

export function Admin() {
  const { 
    user, isAdmin, users, cards, deposits, orders,
    getAdminStats, updateUserBalance, removeUser,
    addCard, removeCard, updateCard, approveDeposit, rejectDeposit,
    sendNotificationToUser, refreshData
  } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Force refresh data on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const [searchUser, setSearchUser] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showEditCardDialog, setShowEditCardDialog] = useState(false);
  const [showUserDetailsDialog, setShowUserDetailsDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  // New card form
  const [newCard, setNewCard] = useState({
    type: 'visa' as const,
    category: 'standard' as const,
    balance: '',
    price: '',
    holderName: '',
  });

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Access denied. Admin only.</p>
          <Button className="btn-primary" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const stats = getAdminStats();
  const regularUsers = users.filter(u => !u.isAdmin);

  const filteredUsers = regularUsers.filter(u => 
    u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.whatsapp.includes(searchUser)
  );

  const activeCards = cards.filter(c => c.status === 'active');
  const soldCards = cards.filter(c => c.status === 'sold');
  const pendingDeposits = deposits.filter(d => d.status === 'pending');

  const handleAddBalance = () => {
    if (!selectedUser || !balanceAmount) return;
    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    updateUserBalance(selectedUser.id, amount);
    toast({
      title: 'Balance added!',
      description: `Added $${amount} to ${selectedUser.username}'s account.`,
    });
    setShowBalanceDialog(false);
    setBalanceAmount('');
    setSelectedUser(null);
    refreshData();
  };

  const handleRemoveBalance = () => {
    if (!selectedUser || !balanceAmount) return;
    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    updateUserBalance(selectedUser.id, -amount);
    toast({
      title: 'Balance removed!',
      description: `Removed $${amount} from ${selectedUser.username}'s account.`,
    });
    setShowBalanceDialog(false);
    setBalanceAmount('');
    setSelectedUser(null);
    refreshData();
  };

  const handleDeleteUser = (userId: string, username: string) => {
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
      removeUser(userId);
      toast({
        title: 'User deleted!',
        description: `User "${username}" has been removed.`,
      });
      refreshData();
    }
  };

  const handleAddCard = () => {
    const balance = parseFloat(newCard.balance);
    const price = parseFloat(newCard.price);
    
    if (isNaN(balance) || isNaN(price) || balance <= 0 || price <= 0) {
      toast({
        title: 'Invalid values',
        description: 'Please enter valid balance and price.',
        variant: 'destructive',
      });
      return;
    }

    const cardNumber = Array(4).fill(0).map(() => 
      Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    ).join(' ');

    const month = Math.floor(Math.random() * 12) + 1;
    const year = 25 + Math.floor(Math.random() * 5);

    const card: CardType = {
      id: 'card_' + Date.now(),
      type: newCard.type,
      number: cardNumber,
      last4: cardNumber.split(' ')[3],
      expiry: `${month.toString().padStart(2, '0')}/${year}`,
      cvv: Math.floor(Math.random() * 900 + 100).toString(),
      holderName: newCard.holderName || `Card Holder`,
      balance,
      price,
      category: newCard.category,
      status: 'active',
      addedAt: new Date().toISOString(),
    };

    addCard(card);
    toast({
      title: 'Card added!',
      description: 'New card has been added to inventory.',
    });
    setShowAddCardDialog(false);
    setNewCard({ type: 'visa', category: 'standard', balance: '', price: '', holderName: '' });
    refreshData();
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      removeCard(cardId);
      toast({
        title: 'Card deleted!',
        description: 'Card has been removed from inventory.',
      });
      refreshData();
    }
  };

  const handleUpdateCard = () => {
    if (!selectedCard) return;
    
    updateCard(selectedCard.id, {
      balance: selectedCard.balance,
      price: selectedCard.price,
      status: selectedCard.status,
    });
    toast({
      title: 'Card updated!',
      description: 'Card details have been updated.',
    });
    setShowEditCardDialog(false);
    setSelectedCard(null);
    refreshData();
  };

  const handleApproveDeposit = (depositId: string) => {
    approveDeposit(depositId);
    toast({
      title: 'Deposit approved!',
      description: 'Funds have been added to user\'s balance.',
    });
    refreshData();
  };

  const handleRejectDeposit = (depositId: string) => {
    rejectDeposit(depositId);
    toast({
      title: 'Deposit rejected!',
      description: 'Deposit has been rejected.',
    });
    refreshData();
  };

  const handleSendNotification = () => {
    if (!selectedUser || !notificationTitle.trim() || !notificationMessage.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    sendNotificationToUser(selectedUser.id, {
      type: 'system',
      title: notificationTitle,
      message: notificationMessage,
      read: false,
    });

    toast({
      title: 'Notification sent!',
      description: `Message sent to ${selectedUser.username}.`,
    });
    setShowNotificationDialog(false);
    setNotificationTitle('');
    setNotificationMessage('');
    setSelectedUser(null);
  };

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

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading">
            Admin <span className="text-gradient-gold">Panel</span>
          </h1>
          <p className="text-muted-foreground">
            Manage users, cards, and deposits
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Cards</p>
                <p className="text-2xl font-bold">{stats.totalCards}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sold Cards</p>
                <p className="text-2xl font-bold">{stats.soldCards}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Deposits</p>
                <p className="text-2xl font-bold">{stats.pendingDeposits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit">
          <TabsTrigger value="users">Users ({regularUsers.length})</TabsTrigger>
          <TabsTrigger value="cards">Cards ({activeCards.length})</TabsTrigger>
          <TabsTrigger value="deposits">Deposits ({pendingDeposits.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by username, email, or WhatsApp..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No users found</p>
            ) : (
              filteredUsers.map((u) => (
                <Card key={u.id} className="border-border/40">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center text-black font-semibold text-lg">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{u.username}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                          <p className="text-xs text-muted-foreground">{u.whatsapp}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined: {new Date(u.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Balance</p>
                          <p className="text-xl font-bold text-gold">${u.balance.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Orders</p>
                          <p className="font-semibold">{orders.filter(o => o.userId === u.id).length}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Deposits</p>
                          <p className="font-semibold">{u.deposits?.length || 0}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(u);
                              setShowUserDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(u);
                              setShowBalanceDialog(true);
                            }}
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(u);
                              setShowNotificationDialog(true);
                            }}
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(u.id, u.username)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Active Cards ({activeCards.length})</h3>
            <Button className="btn-primary" onClick={() => setShowAddCardDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeCards.map((card) => (
              <Card key={card.id} className="border-border/40">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getCardIcon(card.type)}
                      <Badge variant="outline" className="capitalize">{card.category}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs text-muted-foreground">Active</span>
                    </div>
                  </div>
                  
                  <p className="font-mono text-lg tracking-wider mb-1">
                    **** **** **** {card.last4}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">{card.holderName}</p>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-border/40">
                    <div>
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <p className="text-xl font-bold text-gold">${card.balance.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-semibold">${card.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedCard(card);
                        setShowEditCardDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {soldCards.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-8">Sold Cards ({soldCards.length})</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-60">
                {soldCards.slice(0, 6).map((card) => (
                  <Card key={card.id} className="border-border/40">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">SOLD</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(card.soldAt!).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-mono text-lg tracking-wider">
                        **** **** **** {card.last4}
                      </p>
                      <p className="text-sm text-gold mt-2">${card.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Deposits Tab */}
        <TabsContent value="deposits" className="space-y-4">
          <h3 className="text-lg font-semibold">Pending Deposits ({pendingDeposits.length})</h3>
          
          {pendingDeposits.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No pending deposits</p>
          ) : (
            <div className="grid gap-4">
              {pendingDeposits.map((deposit) => {
                const depositUser = users.find(u => u.id === deposit.userId);
                return (
                  <Card key={deposit.id} className="border-border/40 border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-xl text-gold">${deposit.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            User: <span className="font-medium">{depositUser?.username || 'Unknown'}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Email: {depositUser?.email || 'N/A'}
                          </p>
                          <code className="text-xs bg-surface px-2 py-1 rounded mt-2 block">
                            Tx: {deposit.txHash}
                          </code>
                          <p className="text-xs text-muted-foreground mt-2">
                            Submitted: {new Date(deposit.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="bg-green-500 hover:bg-green-600"
                            size="sm"
                            onClick={() => handleApproveDeposit(deposit.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectDeposit(deposit.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* All Deposits */}
          <h3 className="text-lg font-semibold mt-8">All Deposits ({deposits.length})</h3>
          <div className="grid gap-2">
            {deposits.slice(0, 20).map((deposit) => {
              const depositUser = users.find(u => u.id === deposit.userId);
              return (
                <div key={deposit.id} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">${deposit.amount}</span>
                    <span className="text-sm text-muted-foreground">{depositUser?.username}</span>
                    <Badge 
                      variant={deposit.status === 'approved' ? 'default' : deposit.status === 'rejected' ? 'destructive' : 'outline'}
                      className={deposit.status === 'approved' ? 'bg-green-500' : ''}
                    >
                      {deposit.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(deposit.createdAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <h3 className="text-lg font-semibold">All Orders ({orders.length})</h3>
          
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="grid gap-4">
              {orders.slice(0, 50).map((order) => {
                const orderUser = users.find(u => u.id === order.userId);
                return (
                  <Card key={order.id} className="border-border/40">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                            {getCardIcon(order.card.type)}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {order.card.type.toUpperCase()} Card ending in {order.card.last4}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              User: <span className="font-medium">{orderUser?.username || 'Unknown'}</span> • {new Date(order.purchasedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gold">${order.price}</p>
                          <p className="text-sm text-muted-foreground">
                            Balance: ${order.card.balance.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Balance Dialog */}
      <Dialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Balance - {selectedUser?.username}</DialogTitle>
            <DialogDescription>
              Add or remove balance from user account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-surface rounded-lg">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-3xl font-bold text-gold">${selectedUser?.balance.toLocaleString()}</p>
            </div>
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBalanceDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveBalance}>
              <Minus className="h-4 w-4 mr-1" />
              Remove
            </Button>
            <Button className="btn-primary" onClick={handleAddBalance}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={showUserDetailsDialog} onOpenChange={setShowUserDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details - {selectedUser?.username}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <code className="text-xs">{selectedUser.id}</code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{selectedUser.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">{selectedUser.whatsapp}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="font-bold text-gold">${selectedUser.balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">VIP Tier</p>
                  <p className="font-medium capitalize">{selectedUser.vipTier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Purchases</p>
                  <p className="font-medium">${selectedUser.totalPurchases.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Referral Code</p>
                  <code className="text-xs">{selectedUser.referralCode}</code>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-medium">{new Date(selectedUser.joinedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deposits</p>
                <p className="font-medium">{selectedUser.deposits?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="font-medium">{orders.filter(o => o.userId === selectedUser.id).length}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Notification - {selectedUser?.username}</DialogTitle>
            <DialogDescription>
              Send a message to this user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notifTitle">Title</Label>
              <Input
                id="notifTitle"
                placeholder="Enter notification title"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="notifMessage">Message</Label>
              <textarea
                id="notifMessage"
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
                placeholder="Enter your message..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>
              Cancel
            </Button>
            <Button className="btn-primary" onClick={handleSendNotification}>
              <MessageSquare className="h-4 w-4 mr-1" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Card Dialog */}
      <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
            <DialogDescription>
              Add a new card to the inventory
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Card Type</Label>
              <Select
                value={newCard.type}
                onValueChange={(v) => setNewCard({ ...newCard, type: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="amex">Amex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={newCard.category}
                onValueChange={(v) => setNewCard({ ...newCard, category: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cardBalance">Balance ($)</Label>
              <Input
                id="cardBalance"
                type="number"
                placeholder="Enter card balance"
                value={newCard.balance}
                onChange={(e) => setNewCard({ ...newCard, balance: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cardPrice">Price ($)</Label>
              <Input
                id="cardPrice"
                type="number"
                placeholder="Enter card price"
                value={newCard.price}
                onChange={(e) => setNewCard({ ...newCard, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="holderName">Holder Name (Optional)</Label>
              <Input
                id="holderName"
                placeholder="Enter holder name"
                value={newCard.holderName}
                onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCardDialog(false)}>
              Cancel
            </Button>
            <Button className="btn-primary" onClick={handleAddCard}>
              <Plus className="h-4 w-4 mr-1" />
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      <Dialog open={showEditCardDialog} onOpenChange={setShowEditCardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editBalance">Balance ($)</Label>
                <Input
                  id="editBalance"
                  type="number"
                  value={selectedCard.balance}
                  onChange={(e) => setSelectedCard({ ...selectedCard, balance: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="editPrice">Price ($)</Label>
                <Input
                  id="editPrice"
                  type="number"
                  value={selectedCard.price}
                  onChange={(e) => setSelectedCard({ ...selectedCard, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={selectedCard.status}
                  onValueChange={(v) => setSelectedCard({ ...selectedCard, status: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditCardDialog(false)}>
              Cancel
            </Button>
            <Button className="btn-primary" onClick={handleUpdateCard}>
              <Check className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
