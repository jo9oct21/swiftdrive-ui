import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, CreditCard, Phone as PhoneIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

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

// Simulated booked dates for demo
const BOOKED_DATES = [
  '2026-03-05', '2026-03-06', '2026-03-10', '2026-03-11', '2026-03-12',
  '2026-03-20', '2026-03-21',
];

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();
  const car = location.state?.car;

  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      toast({ title: 'Authentication required', description: 'Please login to book a car', variant: 'destructive' });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  const [formData, setFormData] = useState({
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    returnLocation: '',
  });

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]; // 90 days ahead

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;
  };

  const totalDays = calculateDays();
  const totalPrice = car ? totalDays * car.pricePerDay : 0;

  const isDateBooked = (dateStr: string) => BOOKED_DATES.includes(dateStr);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isDateBooked(value)) {
      toast({ title: 'Date Unavailable', description: 'This date is already booked. Please choose another.', variant: 'destructive' });
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) {
      toast({ title: 'Error', description: 'Please select a car first', variant: 'destructive' });
      return;
    }

    const storedPhone = localStorage.getItem('user_phone');
    if (!storedPhone) {
      setPhoneDialogOpen(true);
      return;
    }

    proceedToPayment();
  };

  const proceedToPayment = () => {
    toast({
      title: 'Redirecting to Chapa Payment 💳',
      description: `Processing payment of $${totalPrice} for ${car.name}...`,
    });

    addNotification({
      title: 'Booking Confirmed',
      message: `Your ${car.name} has been booked for ${totalDays} days ($${totalPrice}). Pickup: ${formData.pickupDate} at ${formData.pickupLocation}.`,
      type: 'success',
    });

    setTimeout(() => {
      toast({ title: 'Booking Confirmed! 🎉', description: `Your ${car.name} has been booked for ${totalDays} days.` });
      navigate('/my-bookings');
    }, 2000);
  };

  const handlePhoneSubmit = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({ title: 'Invalid Phone', description: 'Please enter a valid phone number', variant: 'destructive' });
      return;
    }
    localStorage.setItem('user_phone', phoneNumber);
    setPhoneDialogOpen(false);
    proceedToPayment();
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No car selected</h2>
          <Button onClick={() => navigate('/cars')}>Browse Cars</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Rental Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupDate" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" /> Pickup Date *
                        </Label>
                        <Input id="pickupDate" name="pickupDate" type="date" required
                          value={formData.pickupDate} onChange={handleDateChange}
                          min={today} max={maxDate} />
                        <p className="text-xs text-muted-foreground">Min: today, Max: 90 days ahead</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="returnDate" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" /> Return Date *
                        </Label>
                        <Input id="returnDate" name="returnDate" type="date" required
                          value={formData.returnDate} onChange={handleDateChange}
                          min={formData.pickupDate || today} max={maxDate} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupLocation" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" /> Pickup Location *
                        </Label>
                        <Select value={formData.pickupLocation} onValueChange={(v) => setFormData(prev => ({ ...prev, pickupLocation: v }))}>
                          <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                          <SelectContent>
                            {BRANCH_LOCATIONS.map(loc => (
                              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="returnLocation" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" /> Return Location *
                        </Label>
                        <Select value={formData.returnLocation} onValueChange={(v) => setFormData(prev => ({ ...prev, returnLocation: v }))}>
                          <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                          <SelectContent>
                            {BRANCH_LOCATIONS.map(loc => (
                              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Payment via Chapa */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" /> Payment Method
                    </h3>
                    <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 p-6 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-green-500 text-white font-bold text-lg px-3 py-1 rounded-lg">Chapa</div>
                        <span className="text-sm font-medium">Secure Payment Gateway</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Your payment will be processed securely through Chapa.</p>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-gradient-gold hover:shadow-glow text-foreground font-semibold"
                    disabled={!formData.pickupLocation || !formData.returnLocation}>
                    Confirm Booking — ${totalPrice}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{car.name}</h3>
                  <p className="text-sm text-muted-foreground">{car.type}</p>
                </div>
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per day</span>
                    <span className="font-medium">${car.pricePerDay}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Number of days</span>
                    <span className="font-medium">{totalDays}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Phone Number Dialog */}
      <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-primary" /> Phone Number Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Please enter your phone number to proceed with the booking.</p>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+251 9XX XXX XXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhoneDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePhoneSubmit} className="bg-gradient-gold text-foreground">Continue to Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Booking;
