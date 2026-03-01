import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BRANCH_LOCATIONS = [
  'Addis Ababa - Bole',
  'Addis Ababa - Megenagna',
  'Addis Ababa - Piassa',
  'Hawassa - Main Branch',
  'Bahir Dar - City Center',
  'Dire Dawa - Airport',
  'Adama - Downtown',
  'Mekelle - Main Branch',
];

interface SearchBarProps {
  onSearch?: (filters: {
    location: string;
    pickupDate: string;
    returnDate: string;
  }) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ location, pickupDate, returnDate });
    } else {
      const params = new URLSearchParams();
      if (location) params.set('location', location);
      if (pickupDate) params.set('pickupDate', pickupDate);
      if (returnDate) params.set('returnDate', returnDate);
      navigate(`/cars?${params.toString()}`);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-xl p-6 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-primary" />
            Location
          </Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {BRANCH_LOCATIONS.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickup-date" className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            Pickup Date
          </Label>
          <Input
            id="pickup-date"
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            min={today}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="return-date" className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            Return Date
          </Label>
          <Input
            id="return-date"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={pickupDate || today}
            className="w-full"
          />
        </div>

        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full bg-gradient-gold hover:shadow-glow text-foreground font-semibold">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
