import { Shield, Lock, Eye, Database, Cookie, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function Privacy() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-heading mb-4">
          Privacy <span className="text-gradient-gold">Policy</span>
        </h1>
        <p className="text-muted-foreground">
          Last updated: January 2024
        </p>
      </div>

      <div className="space-y-8">
        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Introduction</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              ValidCC Shop ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our platform. Please read this policy carefully. By 
              accessing or using ValidCC, you agree to the practices described in this policy.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We collect several types of information to provide and improve our services:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong>Personal Information:</strong> Username, email address, and account credentials.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong>Transaction Data:</strong> Purchase history, order details, and payment information.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong>Usage Data:</strong> IP address, browser type, device information, and browsing patterns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong>Cookies:</strong> Information stored through cookies and similar technologies.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We use the collected information for various purposes:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>To provide and maintain our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>To process transactions and send order confirmations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>To notify you about changes to our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>To provide customer support and respond to inquiries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>To detect, prevent, and address technical issues or fraud</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>To send promotional communications (with your consent)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Data Security</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your personal information. 
              This includes encryption of data in transit and at rest, secure server infrastructure, 
              and regular security audits. However, no method of transmission over the Internet or 
              electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Cookies Policy</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                ValidCC uses cookies and similar tracking technologies to enhance your browsing experience:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong>Essential Cookies:</strong> Required for core functionality like authentication and security.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong>Preference Cookies:</strong> Remember your settings and preferences.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements.</span>
                </li>
              </ul>
              <p className="leading-relaxed">
                You can control cookies through your browser settings. Note that disabling certain 
                cookies may affect the functionality of our platform.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Contact Us</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@validcc.shop" className="text-gold hover:underline">
                privacy@validcc.shop
              </a>
              . We are committed to addressing your privacy concerns and will respond within 48 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
