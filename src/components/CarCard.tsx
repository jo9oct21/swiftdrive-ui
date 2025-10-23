import { Link } from 'react-router-dom';
import { Star, Users, Gauge, Fuel, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Car } from '@/types/Car';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

interface CarCardProps {
  car: Car;
  index?: number;
}

const CarCard = ({ car, index = 0 }: CarCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -8, rotateY: 2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden group bg-gradient-card border-border/50 hover:border-gold/50 transition-all duration-500 hover:shadow-card">
        <motion.div
          className="aspect-video overflow-hidden relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={car.image}
            alt={`${car.name} - Luxury car rental`}
            className="w-full h-full object-cover"
          />
          {isAuthenticated && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(car.id);
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform z-10"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite(car.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                }`}
              />
            </button>
          )}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </motion.div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-xl mb-1">{car.name}</h3>
              <p className="text-sm text-muted-foreground">{car.type}</p>
              <div className="mt-2">
                {car.available ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 font-medium">
                    Available
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-medium">
                    Not Available
                  </span>
                )}
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 px-3 py-1.5 rounded-lg shadow-lg"
            >
              <Star className="h-4 w-4 fill-white text-white" />
              <span className="text-sm font-bold text-white">{car.rating}</span>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-3 my-5">
            <div className="flex items-center gap-2 text-xs">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{car.seats}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Gauge className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Fuel className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{car.fuel}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-gold">${car.pricePerDay}</span>
              <span className="text-sm text-muted-foreground">per day</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button asChild className="w-full bg-gradient-gold hover:shadow-glow transition-all duration-300 group">
            <Link to={`/car/${car.id}`}>
              View Details
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CarCard;
