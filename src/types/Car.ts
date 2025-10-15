export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: 'SUV' | 'Sedan' | 'Sports' | 'Electric' | 'Luxury' | 'Compact';
  transmission: 'Automatic' | 'Manual';
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  seats: number;
  pricePerDay: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  features: string[];
  description?: string;
  mileage?: string;
  available: boolean;
}

export interface Booking {
  id: string;
  carId: string;
  carName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  totalDays: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface SearchFilters {
  location?: string;
  pickupDate?: string;
  returnDate?: string;
  carType?: string;
  priceRange?: [number, number];
  transmission?: string;
  fuel?: string;
  sortBy?: 'price' | 'popularity' | 'newest' | 'rating';
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}
