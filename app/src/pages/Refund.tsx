import { RefreshCw, Check, X, Clock, Shield, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function Refund() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-heading mb-4">
          Refund <span className="text-gradient-gold">Policy</span>
        </h1>
        <p className="text-muted-foreground">
          Our commitment to customer satisfaction
        </p>
      </div>

      <div className="space-y-8">
        <Card className="border-gold/30 bg-gradient-to-br from-surface to-surface-light">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-gold" />
              <div>
                <h2 className="text-2xl font-semibold">Satisfaction Guarantee</h2>
                <p className="text-muted-foreground">Industry-leading refund protection</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              At ValidCC, we stand behind the quality of our products. Every card undergoes rigorous 
              verification before listing. If a card does not work as described, you are eligible for 
              a full refund within the timeframe specified for your VIP tier.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Refund Timeframes</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { tier: 'Bronze', hours: '24 hours', color: 'bg-gray-500' },
                { tier: 'Silver', hours: '36 hours', color: 'bg-gray-400' },
                { tier: 'Gold', hours: '48 hours', color: 'bg-yellow-500' },
                { tier: 'Platinum', hours: '72 hours', color: 'bg-purple-500' },
                { tier: 'Diamond', hours: '7 days', color: 'bg-blue-500' },
              ].map((item) => (
                <div key={item.tier} className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                  <Badge className={`${item.color} text-white`}>{item.tier}</Badge>
                  <span className="font-medium">{item.hours}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Check className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Eligible for Refund</h2>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">
                You may request a refund under the following circumstances:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-success mt-0.5" />
                  <span>The card balance is significantly lower than advertised (more than 10% difference)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-success mt-0.5" />
                  <span>The card is declined or blocked at the time of purchase verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-success mt-0.5" />
                  <span>The card details provided are incorrect or incomplete</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-success mt-0.5" />
                  <span>Technical issues prevented successful card delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-success mt-0.5" />
                  <span>Duplicate charges on your account</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <X className="h-6 w-6 text-error" />
              <h2 className="text-xl font-semibold">Not Eligible for Refund</h2>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">
                Refunds will not be issued in the following situations:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <X className="h-5 w-5 text-error mt-0.5" />
                  <span>Refund request submitted after the eligible timeframe</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-5 w-5 text-error mt-0.5" />
                  <span>The card has been used or shared with third parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-5 w-5 text-error mt-0.5" />
                  <span>Change of mind after successful card verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-5 w-5 text-error mt-0.5" />
                  <span>Violation of our Terms of Service</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-5 w-5 text-error mt-0.5" />
                  <span>Fraudulent refund requests or abuse of the policy</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">How to Request a Refund</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                To request a refund, please follow these steps:
              </p>
              <ol className="space-y-3 ml-6">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-black text-sm font-bold">1</span>
                  <span>Contact our support team via WhatsApp or email within your eligible timeframe.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-black text-sm font-bold">2</span>
                  <span>Provide your order ID and detailed explanation of the issue.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-black text-sm font-bold">3</span>
                  <span>Our team will verify the issue within 24 hours.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-black text-sm font-bold">4</span>
                  <span>If approved, the refund will be processed to your account balance immediately.</span>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Contact Support</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              For refund requests or questions about this policy, please contact our support team:
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gold">Email:</span>
                <a href="mailto:support@validcc.shop" className="hover:underline">
                  support@validcc.shop
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold">WhatsApp:</span>
                <span>+1 (234) 567-8900</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold">Response Time:</span>
                <span>Within 24 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
