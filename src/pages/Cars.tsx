import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    carType: 'all',
    priceRange: [0, 300],
    transmission: 'all',
    fuel: 'all',
    sortBy: 'popularity',
  });

  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Filter by car type
    if (filters.carType && filters.carType !== 'all') {
      result = result.filter((car) => car.type === filters.carType);
    }

    // Filter by transmission
    if (filters.transmission && filters.transmission !== 'all') {
      result = result.filter((car) => car.transmission === filters.transmission);
    }

    // Filter by fuel
    if (filters.fuel && filters.fuel !== 'all') {
      result = result.filter((car) => car.fuel === filters.fuel);
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
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Fleet</h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Explore our diverse collection of premium vehicles
          </p>
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

                <div className="space-y-2">
                  <Label>Car Type</Label>
                  <Select
                    value={filters.carType}
                    onValueChange={(value) => setFilters({ ...filters, carType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Transmission</Label>
                  <Select
                    value={filters.transmission}
                    onValueChange={(value) => setFilters({ ...filters, transmission: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fuel Type</Label>
                  <Select
                    value={filters.fuel}
                    onValueChange={(value) => setFilters({ ...filters, fuel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
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
                  onClick={() =>
                    setFilters({
                      carType: 'all',
                      priceRange: [0, 300],
                      transmission: 'all',
                      fuel: 'all',
                      sortBy: 'popularity',
                    })
                  }
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
                  onClick={() =>
                    setFilters({
                      carType: 'all',
                      priceRange: [0, 300],
                      transmission: 'all',
                      fuel: 'all',
                      sortBy: 'popularity',
                    })
                  }
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
