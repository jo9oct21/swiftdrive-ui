import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Users, Gauge, Fuel, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cars } from '@/data/cars';
import CarCard from '@/components/CarCard';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const car = cars.find((c) => c.id === id);
  const relatedCars = cars.filter((c) => c.type === car?.type && c.id !== id).slice(0, 3);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast({ 
        title: 'Login required', 
        description: 'Please login to book a car',
        variant: 'destructive' 
      });
      navigate('/login');
    } else {
      navigate('/booking', { state: { car } });
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Car not found</h2>
          <Button asChild>
            <Link to="/cars">Back to Cars</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/cars">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="aspect-video rounded-2xl overflow-hidden bg-gradient-card shadow-card border border-border/50"
            >
              <img
                src={car.images && car.images[selectedImage] ? car.images[selectedImage] : car.image}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Gallery */}
            {car.images && car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {car.images.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-gold shadow-lg' 
                        : 'border-border/50 hover:border-gold/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${car.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Car Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-premium bg-clip-text text-transparent"
                >
                  {car.name}
                </motion.h1>
                <p className="text-xl text-muted-foreground">{car.type} • {car.year}</p>
                <div className="mt-3">
                  {car.available ? (
                    <span className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 font-medium text-sm">
                      ✓ Available Now
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-medium text-sm">
                      ✗ Not Available
                    </span>
                  )}
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 rounded-xl shadow-glow"
              >
                <Star className="h-5 w-5 fill-white text-white" />
                <span className="text-lg font-bold text-white">{car.rating}</span>
                <span className="text-sm text-white/80">({car.reviews})</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="mb-6 glass-card border-border/50 shadow-card">
                <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Seats</p>
                      <p className="font-semibold">{car.seats} People</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Gauge className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-semibold">{car.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Fuel className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-semibold">{car.fuel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Gauge className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-semibold">{car.mileage}</p>
                    </div>
                  </div>
                </div>

                  <div className="border-t border-border pt-6">
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground mb-2">Price per day</p>
                      <div className="flex items-baseline gap-3">
                        <motion.p 
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="text-5xl font-bold text-gold"
                        >
                          ${car.pricePerDay}
                        </motion.p>
                        <span className="text-lg text-muted-foreground">/ day</span>
                      </div>
                    </div>
                    <Button onClick={handleBooking} className="w-full bg-gradient-gold hover:shadow-glow" size="lg">
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        {isAuthenticated ? 'Book Now' : 'Login to Book'} →
                      </motion.span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Description & Features */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6 text-gradient">Description</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{car.description}</p>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6 text-gradient">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {car.features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="bg-gold/10 p-2 rounded-full group-hover:bg-gold/20 transition-colors">
                    <Check className="h-4 w-4 text-gold" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Related Cars */}
        {relatedCars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-gradient">Similar Cars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCars.map((relatedCar, index) => (
                <CarCard key={relatedCar.id} car={relatedCar} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CarDetails;
