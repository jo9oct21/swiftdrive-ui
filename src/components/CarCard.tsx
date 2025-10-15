import { Link } from 'react-router-dom';
import { Star, Users, Gauge, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Car } from '@/types/Car';

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-card">
      <div className="aspect-video overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg">{car.name}</h3>
            <p className="text-sm text-muted-foreground">{car.type}</p>
          </div>
          <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-lg">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{car.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Gauge className="h-4 w-4 text-primary" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Fuel className="h-4 w-4 text-primary" />
            <span>{car.fuel}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">${car.pricePerDay}</p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/car/${car.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
