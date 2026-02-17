import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Copy, Check, Wallet, ArrowRight, History, 
  Bitcoin, AlertCircle, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// USDT Deposit Address
const USDT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4';

export function Deposit() {
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, deposits, addDeposit } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please login to make a deposit.</p>
          <Button className="btn-primary" onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(USDT_ADDRESS);
    setCopied(true);
    toast({
      title: 'Address copied!',
      description: 'USDT address copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount < 10) {
      toast({
        title: 'Invalid amount',
        description: 'Minimum deposit amount is $10.',
        variant: 'destructive',
      });
      return;
    }

    if (!txHash || txHash.length < 10) {
      toast({
        title: 'Invalid Transaction Hash',
        description: 'Please enter a valid transaction hash.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const deposit = {
      id: 'dep_' + Date.now(),
      userId: user!.id,
      amount: depositAmount,
      txHash: txHash,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    addDeposit(deposit);

    toast({
      title: 'Deposit submitted!',
      description: 'Your deposit is pending approval. You will be notified once approved.',
    });

    setAmount('');
    setTxHash('');
    setIsSubmitting(false);
  };

  const userDeposits = deposits.filter(d => d.userId === user?.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">
          Deposit <span className="text-gradient-gold">Funds</span>
        </h1>
        <p className="text-muted-foreground">
          Add funds to your account using USDT (TRC20)
        </p>
      </div>

      <Tabs defaultValue="deposit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit">Make Deposit</TabsTrigger>
          <TabsTrigger value="history">Deposit History</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-6">
          {/* USDT Address Card */}
          <Card className="border-gold/30 bg-gradient-to-br from-surface to-surface-light">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5 text-gold" />
                USDT Deposit Address (TRC20)
              </CardTitle>
              <CardDescription>
                Send USDT to the address below. Funds will be credited after confirmation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-background rounded-lg">
                <code className="flex-1 text-sm break-all">{USDT_ADDRESS}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 mt-0.5 text-gold" />
                <div>
                  <p>Minimum deposit: $10</p>
                  <p>Network: TRC20 (Tron)</p>
                  <p>Processing time: 10-30 minutes after confirmation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Deposit Form */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Submit Deposit</CardTitle>
              <CardDescription>
                After sending USDT, submit your transaction details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Deposit Amount (USD)</Label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount (min $10)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                      min="10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="txHash">Transaction Hash (TxID)</Label>
                  <Input
                    id="txHash"
                    type="text"
                    placeholder="Enter transaction hash"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    You can find this in your wallet's transaction history
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      Submit Deposit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-gold" />
                Your Deposit History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userDeposits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No deposits yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userDeposits.map((deposit) => (
                    <div
                      key={deposit.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-surface"
                    >
                      <div>
                        <p className="font-semibold">${deposit.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(deposit.createdAt).toLocaleString()}
                        </p>
                        <code className="text-xs text-muted-foreground">
                          Tx: {deposit.txHash.slice(0, 20)}...
                        </code>
                      </div>
                      <div>{getStatusBadge(deposit.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
