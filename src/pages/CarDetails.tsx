import { useParams, Link } from 'react-router-dom';
import { Star, Users, Gauge, Fuel, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cars } from '@/data/cars';
import CarCard from '@/components/CarCard';

const CarDetails = () => {
  const { id } = useParams();
  const car = cars.find((c) => c.id === id);
  const relatedCars = cars.filter((c) => c.type === car?.type && c.id !== id).slice(0, 3);

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/cars">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-video rounded-xl overflow-hidden bg-secondary">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Car Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{car.name}</h1>
                <p className="text-lg text-muted-foreground">{car.type} • {car.year}</p>
              </div>
              <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="text-lg font-semibold">{car.rating}</span>
                <span className="text-sm text-muted-foreground">({car.reviews})</span>
              </div>
            </div>

            <Card className="mb-6 bg-gradient-card">
              <CardContent className="p-6">
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
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price per day</p>
                      <p className="text-4xl font-bold text-primary">${car.pricePerDay}</p>
                    </div>
                  </div>
                  <Button asChild className="w-full" size="lg">
                    <Link to="/booking" state={{ car }}>
                      Book Now
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{car.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Cars */}
        {relatedCars.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Similar Cars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCars.map((relatedCar) => (
                <CarCard key={relatedCar.id} car={relatedCar} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetails;
