import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, Star, Zap, Shield, Search, Bell, Globe, Smartphone,
  UserPlus, Gift, ShoppingCart, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { features, howItWorks, stats, testimonials } from '@/data/cards';
import { useAuth } from '@/context/AuthContext';

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fade-in-up');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}

export function Home() {
  const { isAuthenticated, user } = useAuth();

  const iconMap: Record<string, React.ElementType> = {
    Zap, Shield, Search, Bell, Globe, Smartphone,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
        <div className="container relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <Badge variant="outline" className="w-fit border-gold/50 text-gold">
                Established 2020 | 50,000+ Happy Customers
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-heading">
                Welcome to{' '}
                <span className="text-gradient-gold">ValidCC Shop</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                The world's most trusted premium card marketplace. Get instant access to 
                verified, high-balance cards with guaranteed functionality. 
                {isAuthenticated ? (
                  <span className="text-gold block mt-2">
                    Welcome back, {user?.username}! Your balance: ${user?.balance.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-gold block mt-2">
                    Deposit USDT and start shopping instantly!
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop">
                  <Button size="lg" className="btn-primary gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Start Shopping
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/register">
                    <Button size="lg" variant="outline" className="gap-2 border-gold/50 hover:bg-gold/10">
                      <UserPlus className="h-5 w-5" />
                      Create Account
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-2xl font-bold text-gold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Hero Image/Graphic */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -inset-4 bg-gold/20 rounded-3xl blur-3xl" />
                <Card className="relative bg-gradient-to-br from-surface to-surface-light border-gold/20 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-xs text-muted-foreground">ValidCC Premium</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center">
                          <Check className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <p className="font-semibold">Verified Cards</p>
                          <p className="text-sm text-muted-foreground">500+ Live Inventory</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center">
                          <Zap className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <p className="font-semibold">Instant Delivery</p>
                          <p className="text-sm text-muted-foreground">Get cards in seconds</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center">
                          <Shield className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <p className="font-semibold">Secure & Safe</p>
                          <p className="text-sm text-muted-foreground">Bank-grade encryption</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface/50">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4">
              Why Choose <span className="text-gradient-gold">ValidCC</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform stands apart through comprehensive features designed for seamless user experience.
            </p>
          </AnimatedSection>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              return (
                <AnimatedSection key={index} delay={index * 100}>
                  <Card className="h-full card-hover border-border/40 bg-background/50">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-gold" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4">
              How It <span className="text-gradient-gold">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started with ValidCC takes less than two minutes. Follow these simple steps.
            </p>
          </AnimatedSection>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="relative text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gold flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-black">{step.step}</span>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-surface/50">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4">
              Trusted by <span className="text-gradient-gold">Thousands</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ValidCC has earned industry recognition through consistent excellence and transparent operations.
            </p>
          </AnimatedSection>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '4.9', label: 'Star Rating', sublabel: '12,000+ Reviews' },
              { value: '$2M+', label: 'Monthly Volume', sublabel: 'Zero Breaches' },
              { value: '15min', label: 'Avg Response', sublabel: '24/7 Support' },
              { value: '98%', label: 'First Contact', sublabel: 'Resolution Rate' },
            ].map((stat, index) => (
              <AnimatedSection key={index}>
                <Card className="text-center border-border/40 bg-background/50">
                  <CardContent className="p-6">
                    <p className="text-4xl font-bold text-gold mb-1">{stat.value}</p>
                    <p className="font-medium">{stat.label}</p>
                    <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4">
              What Our <span className="text-gradient-gold">Customers</span> Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust ValidCC for their card needs.
            </p>
          </AnimatedSection>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.id} delay={index * 100}>
                <Card className="h-full border-border/40 bg-background/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-sm mb-4">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gold flex items-center justify-center text-black font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <AnimatedSection>
            <Card className="border-gold/20 bg-gradient-to-br from-surface to-surface-light overflow-hidden">
              <CardContent className="p-8 md:p-12 text-center">
                <Gift className="h-12 w-12 text-gold mx-auto mb-4" />
                <h2 className="text-3xl font-bold font-heading mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                  Create your free account and deposit USDT to start shopping premium cards. 
                  Instant delivery and 24/7 support!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/register">
                    <Button size="lg" className="btn-primary gap-2">
                      <UserPlus className="h-5 w-5" />
                      Create Free Account
                    </Button>
                  </Link>
                  <Link to="/shop">
                    <Button size="lg" variant="outline" className="gap-2 border-gold/50 hover:bg-gold/10">
                      <Eye className="h-5 w-5" />
                      Browse Cards
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
