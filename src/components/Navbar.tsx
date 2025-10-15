import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/cars', label: 'Cars' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-md"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-primary p-2 rounded-lg"
            >
              <Car className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-premium bg-clip-text text-transparent">
              DriveNow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                  isActive(link.path) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.label}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button asChild className="bg-gradient-gold hover:shadow-glow transition-all duration-300">
              <Link to="/booking">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive(link.path) ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild className="w-full bg-gradient-gold">
                  <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>
                    Book Now
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
