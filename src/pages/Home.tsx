import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import FeaturedCarsCarousel from '@/components/FeaturedCarsCarousel';
import AnimatedCounter from '@/components/AnimatedCounter';
import { cars } from '@/data/cars';
import heroBg from '@/assets/hero-bg.jpg';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

const Home = () => {
  const { theme } = useTheme();
  const featuredCars = cars.slice(0, 6);

  const benefits = [
    {
      icon: Shield,
      title: '24/7 Support',
      description: 'Our team is always ready to help you, anytime, anywhere.',
    },
    {
      icon: DollarSign,
      title: 'Affordable Prices',
      description: 'Get the best deals with transparent pricing and no hidden fees.',
    },
    {
      icon: Clock,
      title: 'Easy Booking',
      description: 'Book your car in minutes with our simple and fast process.',
    },
  ];

  const stats = [
    { end: 10000, suffix: '+', label: 'Happy Customers' },
    { end: 500, suffix: '+', label: 'Premium Cars' },
    { end: 100, suffix: '+', label: 'Global Cities' },
    { end: 50, suffix: '+', label: 'Awards Won' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing service! The car was in perfect condition and the booking process was seamless.',
      date: 'March 2024',
    },
    {
      name: 'Michael Chen',
      rating: 5,
      comment: 'Great selection of cars and very professional staff. Highly recommend!',
      date: 'February 2024',
    },
    {
      name: 'Emma Williams',
      rating: 5,
      comment: 'Best car rental experience ever. Will definitely use again!',
      date: 'March 2024',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[700px] flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: theme === 'light' 
            ? `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.6)), url(${heroBg})`
            : `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
                theme === 'light' ? 'text-foreground' : 'text-white'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Drive Your Dream
              <span className="block luxury-text-gradient mt-2">
                In Ultimate Luxury
              </span>
            </motion.h1>
            <motion.p
              className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto ${
                theme === 'light' ? 'text-muted-foreground' : 'text-white/90'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience premium cars at unbeatable prices. Your journey to excellence starts here.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" asChild className="bg-gradient-gold hover:shadow-glow text-foreground font-semibold px-8 py-6 text-lg">
                <Link to="/cars">
                  Explore Our Fleet
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gold/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4 -mt-20 relative z-20 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SearchBar />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-premium py-20 mb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                <p className={`mt-2 font-medium ${theme === 'light' ? 'text-foreground' : 'text-white/90'}`}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="container mx-auto px-4 mb-24">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="luxury-text-gradient">Vehicles</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium vehicles, ready for your next adventure
          </p>
        </motion.div>
        <FeaturedCarsCarousel cars={featuredCars} />
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button variant="outline" size="lg" asChild className="border-gold text-gold hover:bg-gold hover:text-foreground">
            <Link to="/cars">View Entire Collection</Link>
          </Button>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary/30 py-24 mb-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="luxury-text-gradient">DriveNow</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide the best car rental experience with unmatched service and luxury
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10, rotateX: 5 }}
                className="text-center p-8 bg-card rounded-2xl shadow-elegant border border-border/50 hover:border-gold/50 hover:shadow-glow transition-all duration-300"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold rounded-full mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <benefit.icon className="h-10 w-10 text-foreground" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground text-base">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="luxury-text-gradient">Clients Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real experiences from real customers who chose excellence
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-card p-8 rounded-2xl shadow-elegant border border-border/50 hover:border-gold/30 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic text-base leading-relaxed">
                "{testimonial.comment}"
              </p>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="font-semibold text-lg">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-premium py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'light' ? 'text-foreground' : 'text-white'
            }`}>
              Ready to Start Your Journey?
            </h2>
            <p className={`text-lg mb-10 ${
              theme === 'light' ? 'text-muted-foreground' : 'text-white/90'
            }`}>
              Book your dream car today and experience luxury on the road like never before
            </p>
            <Button size="lg" asChild className="bg-gradient-gold hover:shadow-glow text-foreground font-semibold px-10 py-6 text-lg">
              <Link to="/cars">
                Browse All Cars
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
