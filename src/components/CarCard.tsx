import { Link } from 'react-router-dom';
import { Star, Users, Gauge, Fuel, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Car } from '@/types/Car';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';

interface CarCardProps {
  car: Car;
  index?: number;
}

const CarCard = ({ car, index = 0 }: CarCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </motion.div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-xl mb-1">{car.name}</h3>
              <p className="text-sm text-muted-foreground">{car.type}</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex items-center gap-1 bg-gold/10 px-3 py-1.5 rounded-lg border border-gold/20"
            >
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="text-sm font-semibold text-gold">{car.rating}</span>
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

          <div className="flex items-end justify-between pt-4 border-t border-border">
            <div>
              <p className="text-3xl font-bold bg-gradient-premium bg-clip-text text-transparent">
                ${car.pricePerDay}
              </p>
              <p className="text-xs text-muted-foreground">per day</p>
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
