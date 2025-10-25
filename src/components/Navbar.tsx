import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Car, Heart, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const { favorites } = useFavorites();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out', description: 'See you soon!' });
    navigate('/');
  };

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/cars', label: 'Cars' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const userLinks = [
    ...publicLinks,
    { path: '/my-bookings', label: 'My Bookings' },
  ];

  const links = isAuthenticated ? userLinks : publicLinks;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Car className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-xl font-bold text-gradient">
              LuxeDrive
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative group"
              >
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-gold'
                    : theme === 'light' ? 'text-foreground hover:text-gold' : 'text-white hover:text-gold'
                }`}>
                  {link.label}
                </span>
                <span 
                  className="absolute -bottom-1 left-0 h-0.5 transition-all duration-300 origin-left"
                  style={{
                    width: location.pathname === link.path ? '100%' : '0%',
                    background: location.pathname === link.path 
                      ? 'linear-gradient(90deg, hsl(43 96% 56%) 0%, hsl(38 92% 50%) 100%)'
                      : 'transparent'
                  }}
                />
                <span 
                  className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 origin-left"
                  style={{
                    background: 'linear-gradient(90deg, hsl(43 96% 56%) 0%, hsl(38 92% 50%) 100%)'
                  }}
                />
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link to="/favorites" className="relative">
                <Button variant="ghost" size="icon" className="hover-glow hover:text-gold">
                  <Heart className={`h-5 w-5 transition-colors ${
                    theme === 'light' ? 'text-foreground hover:text-gold' : 'text-white hover:text-gold'
                  }`} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            
            <ThemeToggle />
            
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Link to="/login">
                <Button variant="gradient" size="sm" className="shadow-lg">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="py-4 space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 px-4 rounded-lg transition-all duration-300 ${
                      location.pathname === link.path
                        ? 'glass-card text-gold'
                        : 'text-foreground hover:bg-accent/10'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    to="/favorites"
                    className="flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 text-foreground hover:bg-accent/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    Favorites
                    {favorites.length > 0 && (
                      <span className="ml-auto bg-gold text-foreground text-xs px-2 py-0.5 rounded-full font-bold">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                )}
                <div className="px-4 space-y-2">
                  {isAuthenticated ? (
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <Button variant="gradient" className="w-full" size="sm">
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
