import { FileText, Scale, AlertTriangle, UserX, Gavel, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function Terms() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-heading mb-4">
          Terms of <span className="text-gradient-gold">Service</span>
        </h1>
        <p className="text-muted-foreground">
          Last updated: January 2024
        </p>
      </div>

      <div className="space-y-8">
        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Agreement to Terms</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using ValidCC Shop ("Platform"), you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access the Platform. These terms apply 
              to all visitors, users, and others who access or use the Platform.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Eligibility</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                By using our Platform, you represent and warrant that:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>You are at least 18 years of age or the age of majority in your jurisdiction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>You have the legal capacity to enter into binding contracts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>You will use the Platform in compliance with all applicable laws and regulations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>All information you provide is accurate, complete, and current.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Prohibited Activities</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Attempting to access other users' accounts or unauthorized areas of the Platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Using cards for illegal transactions or fraudulent activities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Charging back legitimate purchases or disputing valid transactions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Distributing purchased card details publicly or to third parties.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Automated scraping, data mining, or harvesting of inventory data.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Interfering with or disrupting the security, integrity, or performance of the Platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Creating multiple accounts to abuse promotions or referral programs.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Intellectual Property</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The Platform and its original content, features, and functionality are and will remain the 
              exclusive property of ValidCC Shop and its licensors. The Platform is protected by copyright, 
              trademark, and other laws. Our trademarks and trade dress may not be used in connection with 
              any product or service without prior written consent.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Limitation of Liability</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall ValidCC Shop, its directors, employees, partners, agents, suppliers, or 
              affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
              resulting from your access to or use of or inability to access or use the Platform. Our total 
              liability for any claim arising from or relating to these terms or our services shall not exceed 
              the amount you paid for the specific transaction giving rise to the claim.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserX className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Account Termination</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, 
                for any reason, including but not limited to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Violation of these Terms of Service</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Fraudulent or suspicious activity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Chargebacks or payment disputes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Extended period of account inactivity</span>
                </li>
              </ul>
              <p className="leading-relaxed">
                Upon termination, your right to use the Platform will immediately cease. All provisions 
                of these terms which by their nature should survive termination shall survive.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Governing Law</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of the State of New York, 
              United States, without regard to its conflict of law provisions. Any dispute arising from or 
              relating to these terms shall be resolved through binding arbitration in New York, NY. 
              The arbitration shall be conducted in English.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Changes to Terms</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days' notice prior to any new 
              terms taking effect. What constitutes a material change will be determined at our sole discretion. 
              By continuing to access or use our Platform after those revisions become effective, you agree 
              to be bound by the revised terms.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-semibold">Contact Us</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@validcc.shop" className="text-gold hover:underline">
                legal@validcc.shop
              </a>
              . We are committed to addressing your concerns and will respond within 48 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
