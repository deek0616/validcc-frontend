import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, User, Bell, Wallet, LogOut, 
  ChevronDown, Package, DollarSign, Shield
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout, notifications, markNotificationRead } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold">
            <span className="text-lg font-bold text-black">VC</span>
          </div>
          <span className="hidden text-xl font-bold text-gradient-gold sm:inline-block">
            ValidCC
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-gold ${
                location.pathname === link.href ? 'text-gold' : 'text-muted-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/deposit"
              className={`text-sm font-medium transition-colors hover:text-gold ${
                location.pathname === '/deposit' ? 'text-gold' : 'text-muted-foreground'
              }`}
            >
              Deposit
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className={`text-sm font-medium transition-colors hover:text-gold flex items-center gap-1 ${
                location.pathname === '/admin' ? 'text-gold' : 'text-muted-foreground'
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Balance Display */}
              <div className="hidden items-center gap-2 rounded-lg bg-surface px-3 py-1.5 sm:flex">
                <Wallet className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium">
                  ${user?.balance.toLocaleString()}
                </span>
              </div>

              {/* Notifications */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center p-0 text-xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-gold" />
                      Notifications
                    </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="mt-4 h-[calc(100vh-8rem)]">
                    <div className="space-y-3">
                      {notifications.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No notifications yet
                        </p>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-surface ${
                              notification.read ? 'opacity-60' : 'border-gold/30'
                            }`}
                            onClick={() => markNotificationRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 h-2 w-2 rounded-full ${
                                notification.read ? 'bg-muted' : 'bg-gold'
                              }`} />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{notification.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-black font-semibold">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user?.username}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-black font-semibold">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.vipTier} Member</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile?tab=orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/deposit')}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Deposit
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-error">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button className="btn-primary" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold">
                    <span className="text-lg font-bold text-black">VC</span>
                  </div>
                  ValidCC
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      location.pathname === link.href 
                        ? 'bg-gold/10 text-gold' 
                        : 'hover:bg-surface'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {isAuthenticated && (
                  <>
                    <Link
                      to="/deposit"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                        location.pathname === '/deposit' 
                          ? 'bg-gold/10 text-gold' 
                          : 'hover:bg-surface'
                      }`}
                    >
                      <DollarSign className="h-5 w-5" />
                      Deposit
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                        location.pathname === '/profile' 
                          ? 'bg-gold/10 text-gold' 
                          : 'hover:bg-surface'
                      }`}
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      location.pathname === '/admin' 
                        ? 'bg-gold/10 text-gold' 
                        : 'hover:bg-surface'
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    Admin Panel
                  </Link>
                )}
                
                {isAuthenticated && (
                  <>
                    <div className="border-t border-border my-2" />
                    <div className="flex items-center gap-2 rounded-lg bg-surface px-4 py-3">
                      <Wallet className="h-5 w-5 text-gold" />
                      <span className="font-medium">
                        Balance: ${user?.balance.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-error hover:bg-error/10 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
