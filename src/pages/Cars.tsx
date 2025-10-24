import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import carBg from '@/assets/car-suv.jpg';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import CarCard from '@/components/CarCard';
import { cars } from '@/data/cars';
import { SearchFilters } from '@/types/Car';

const Cars = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    carType: 'all',
    priceRange: [0, 300],
    transmission: 'all',
    fuel: 'all',
    sortBy: 'popularity',
  });

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);

  // Handle search params from home page
  useEffect(() => {
    const location = searchParams.get('location');
    const pickupDate = searchParams.get('pickupDate');
    const returnDate = searchParams.get('returnDate');

    if (location || pickupDate || returnDate) {
      const searchInfo = [];
      if (location) searchInfo.push(`Location: ${location}`);
      if (pickupDate) searchInfo.push(`Pickup: ${pickupDate}`);
      if (returnDate) searchInfo.push(`Return: ${returnDate}`);
      
      toast.success(`Search applied: ${searchInfo.join(', ')}`);
    }
  }, [searchParams]);

  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Filter by car type
    if (selectedTypes.length > 0) {
      result = result.filter((car) => selectedTypes.includes(car.type));
    }

    // Filter by transmission
    if (selectedTransmissions.length > 0) {
      result = result.filter((car) => selectedTransmissions.includes(car.transmission));
    }

    // Filter by fuel
    if (selectedFuels.length > 0) {
      result = result.filter((car) => selectedFuels.includes(car.fuel));
    }

    // Filter by price range
    if (filters.priceRange) {
      result = result.filter(
        (car) =>
          car.pricePerDay >= filters.priceRange![0] &&
          car.pricePerDay <= filters.priceRange![1]
      );
    }

    // Sort
    if (filters.sortBy === 'price') {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [filters, selectedTypes, selectedTransmissions, selectedFuels]);

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: theme === 'light' 
            ? `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${carBg})`
            : `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${carBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl md:text-6xl font-bold mb-4 ${
              theme === 'light' ? 'text-foreground' : 'text-white'
            }`}
          >
            Our Fleet
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-xl max-w-2xl ${
              theme === 'light' ? 'text-muted-foreground' : 'text-white/90'
            }`}
          >
            Explore our diverse collection of premium vehicles
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20">
              <Button
                variant="outline"
                className="w-full lg:hidden mb-4"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>

              <div
                className={`bg-card rounded-xl p-6 border border-border space-y-6 ${
                  showFilters ? 'block' : 'hidden lg:block'
                }`}
              >
                <div>
                  <h3 className="font-semibold mb-4">Filters</h3>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Car Type</Label>
                  <div className="space-y-2">
                    {['SUV', 'Sedan', 'Sports', 'Electric', 'Luxury'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTypes([...selectedTypes, type]);
                            } else {
                              setSelectedTypes(selectedTypes.filter((t) => t !== type));
                            }
                          }}
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Transmission</Label>
                  <div className="space-y-2">
                    {['Automatic', 'Manual'].map((trans) => (
                      <div key={trans} className="flex items-center space-x-2">
                        <Checkbox
                          id={`trans-${trans}`}
                          checked={selectedTransmissions.includes(trans)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTransmissions([...selectedTransmissions, trans]);
                            } else {
                              setSelectedTransmissions(selectedTransmissions.filter((t) => t !== trans));
                            }
                          }}
                        />
                        <label
                          htmlFor={`trans-${trans}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {trans}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Fuel Type</Label>
                  <div className="space-y-2">
                    {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map((fuel) => (
                      <div key={fuel} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fuel-${fuel}`}
                          checked={selectedFuels.includes(fuel)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedFuels([...selectedFuels, fuel]);
                            } else {
                              setSelectedFuels(selectedFuels.filter((f) => f !== fuel));
                            }
                          }}
                        />
                        <label
                          htmlFor={`fuel-${fuel}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {fuel}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Price Range (per day)</Label>
                  <div className="px-2">
                    <Slider
                      min={0}
                      max={300}
                      step={10}
                      value={filters.priceRange}
                      onValueChange={(value) =>
                        setFilters({ ...filters, priceRange: value as [number, number] })
                      }
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${filters.priceRange?.[0]}</span>
                    <span>${filters.priceRange?.[1]}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setFilters({
                      carType: 'all',
                      priceRange: [0, 300],
                      transmission: 'all',
                      fuel: 'all',
                      sortBy: 'popularity',
                    });
                    setSelectedTypes([]);
                    setSelectedTransmissions([]);
                    setSelectedFuels([]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'}
              </p>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters({ ...filters, sortBy: value as SearchFilters['sortBy'] })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No cars found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setFilters({
                      carType: 'all',
                      priceRange: [0, 300],
                      transmission: 'all',
                      fuel: 'all',
                      sortBy: 'popularity',
                    });
                    setSelectedTypes([]);
                    setSelectedTransmissions([]);
                    setSelectedFuels([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;
