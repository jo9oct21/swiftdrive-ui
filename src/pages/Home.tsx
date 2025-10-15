import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import CarCard from '@/components/CarCard';
import { cars } from '@/data/cars';
import heroBg from '@/assets/hero-bg.jpg';

const Home = () => {
  const featuredCars = cars.slice(0, 3);

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
        className="relative h-[600px] flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect Ride
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover premium cars at unbeatable prices. Your journey starts here.
          </p>
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90">
            <Link to="/cars">
              Browse Cars
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4 -mt-16 relative z-10 mb-20">
        <SearchBar />
      </section>

      {/* Featured Cars */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Cars</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our handpicked selection of premium vehicles
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link to="/cars">View All Cars</Link>
          </Button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DriveNow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the best car rental experience with unmatched service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow animate-scale-in"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real experiences from real customers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl shadow-md border border-border hover:shadow-lg transition-shadow animate-fade-in-up"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">{testimonial.comment}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
