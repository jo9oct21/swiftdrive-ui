import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Car, DollarSign, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { useNotifications } from '@/contexts/NotificationContext';
import bookingBg from '@/assets/car-sedan.jpg';
import { BookingDetailsDialog } from '@/components/BookingDetailsDialog';
import { cars } from '@/data/cars';

type BookingStatus = 'pending' | 'confirmed' | 'upcoming' | 'active' | 'completed' | 'cancelled' | 'failed' | 'overdue';

interface BookingItem {
  id: number;
  car: string;
  carId: string;
  pickupDate: string;
  returnDate: string;
  location: string;
  baseCost: number;
  penaltyAmount: number;
  penaltyPaid: boolean;
  penaltyType?: string;
  status: BookingStatus;
  carTaken: boolean;
  carDelivered: boolean;
  carProblem: boolean;
  refundAmount: number;
  refundStatus: 'none' | 'processing' | 'refunded';
}

const initialBookings: BookingItem[] = [
  { id: 1, car: 'Tesla Model 3', carId: '1', pickupDate: '2026-03-10', returnDate: '2026-03-15', location: 'Addis Ababa - Bole', baseCost: 445, penaltyAmount: 0, penaltyPaid: false, status: 'upcoming', carTaken: false, carDelivered: false, carProblem: false, refundAmount: 0, refundStatus: 'none' },
  { id: 2, car: 'BMW X5', carId: '2', pickupDate: '2026-02-20', returnDate: '2026-02-28', location: 'Hawassa - Main Branch', baseCost: 625, penaltyAmount: 0, penaltyPaid: false, status: 'active', carTaken: true, carDelivered: true, carProblem: false, refundAmount: 0, refundStatus: 'none' },
  { id: 3, car: 'Porsche 911', carId: '3', pickupDate: '2026-01-10', returnDate: '2026-01-13', location: 'Bahir Dar - City Center', baseCost: 897, penaltyAmount: 100, penaltyPaid: false, penaltyType: 'damage', status: 'completed', carTaken: true, carDelivered: true, carProblem: false, refundAmount: 0, refundStatus: 'none' },
  { id: 4, car: 'Mercedes C-Class', carId: '4', pickupDate: '2026-02-01', returnDate: '2026-02-05', location: 'Dire Dawa - Airport', baseCost: 380, penaltyAmount: 38, penaltyPaid: false, status: 'cancelled', carTaken: false, carDelivered: false, carProblem: false, refundAmount: 342, refundStatus: 'refunded' },
  { id: 5, car: 'Audi Q7', carId: '5', pickupDate: '2026-02-15', returnDate: '2026-02-18', location: 'Adama - Downtown', baseCost: 345, penaltyAmount: 0, penaltyPaid: false, status: 'failed', carTaken: false, carDelivered: false, carProblem: true, refundAmount: 345, refundStatus: 'refunded' },
];

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<BookingItem | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({ title: 'Authentication required', description: 'Please login to view your bookings', variant: 'destructive' });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  // State machine logic
  useEffect(() => {
    const now = new Date();
    setBookings(prev => prev.map(b => {
      const startDate = new Date(b.pickupDate);
      const endDate = new Date(b.returnDate);

      // Confirmed → Upcoming (before start date)
      if (b.status === 'confirmed' && now < startDate) {
        return { ...b, status: 'upcoming' as BookingStatus };
      }

      // Upcoming + start date arrived + car delivered → Active
      if (b.status === 'upcoming' && now >= startDate && now <= endDate && b.carDelivered) {
        return { ...b, status: 'active' as BookingStatus, carTaken: true };
      }

      // Upcoming + start date arrived + car has problem → Failed
      if (b.status === 'upcoming' && now >= startDate && b.carProblem) {
        addNotification({ title: 'Booking Failed', message: `Your booking for ${b.car} failed due to a car problem. A full refund is being processed.`, type: 'warning' });
        return { ...b, status: 'failed' as BookingStatus, refundAmount: b.baseCost, refundStatus: 'processing' as const };
      }

      // Auto-cancel: upcoming, not delivered, return date passed
      if (b.status === 'upcoming' && !b.carDelivered && now > endDate) {
        addNotification({ title: 'Booking Auto-Cancelled', message: `Your booking for ${b.car} was automatically cancelled because the return date passed without pickup.`, type: 'warning' });
        return { ...b, status: 'cancelled' as BookingStatus };
      }

      // Active → Overdue (end date passed, car not returned)
      if (b.status === 'active' && now > endDate) {
        const daysLate = Math.ceil((now.getTime() - endDate.getTime()) / 86400000);
        const penaltyPerDay = 50;
        const totalPenalty = daysLate * penaltyPerDay;
        return { ...b, status: 'overdue' as BookingStatus, penaltyAmount: totalPenalty, penaltyType: 'late_return' };
      }

      // Overdue: keep updating penalty
      if (b.status === 'overdue') {
        const daysLate = Math.ceil((now.getTime() - endDate.getTime()) / 86400000);
        const penaltyPerDay = 50;
        const totalPenalty = daysLate * penaltyPerDay;
        if (totalPenalty !== b.penaltyAmount) {
          return { ...b, penaltyAmount: totalPenalty };
        }
      }

      return b;
    }));
  }, []);

  if (!isAuthenticated) return null;

  const getCarImage = (carId: string) => {
    const carData = cars.find(c => c.id === carId);
    return carData?.image || bookingBg;
  };

  const handleCancelBooking = (booking: BookingItem) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (bookingToCancel) {
      const cancellationPenalty = Math.round(bookingToCancel.baseCost * 0.10);
      const refund = bookingToCancel.baseCost - cancellationPenalty;
      setBookings(prev => prev.map(b => b.id === bookingToCancel.id ? {
        ...b,
        status: 'cancelled' as BookingStatus,
        penaltyAmount: cancellationPenalty,
        refundAmount: refund,
        refundStatus: 'refunded' as const,
      } : b));
      addNotification({
        title: 'Booking Cancelled',
        message: `Your booking for ${bookingToCancel.car} has been cancelled. 10% cancellation fee ($${cancellationPenalty}) applied. Refund: $${refund}.`,
        type: 'warning',
      });
      toast({ title: 'Booking Cancelled', description: `Refund of $${refund} processed. 10% penalty ($${cancellationPenalty}) applied.` });
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const handleBookAgain = (booking: BookingItem) => {
    const carData = cars.find(c => c.id === booking.carId);
    if (!carData) { navigate('/cars'); return; }

    // For active/upcoming: extend booking, start from current return date
    if (booking.status === 'active' || booking.status === 'upcoming') {
      navigate('/booking', { state: { car: carData, startFromDate: booking.returnDate } });
    } else {
      navigate('/booking', { state: { car: carData } });
    }
  };

  const handlePayPenalty = (booking: BookingItem) => {
    toast({
      title: 'Redirecting to Chapa Payment 💳',
      description: `Processing penalty payment of $${booking.penaltyAmount} for ${booking.car}...`,
    });
    setTimeout(() => {
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, penaltyPaid: true } : b));
      addNotification({ title: 'Penalty Paid', message: `Your penalty of $${booking.penaltyAmount} for ${booking.car} has been paid successfully.`, type: 'success' });
      toast({ title: 'Penalty Paid! ✅', description: `$${booking.penaltyAmount} penalty for ${booking.car} has been paid.` });
    }, 2000);
  };

  // Show pay penalty only for: overdue (end date passed), or completed with damage/fuel/dirty penalties
  const showPayPenalty = (booking: BookingItem) => {
    if (booking.penaltyPaid || booking.penaltyAmount <= 0) return false;
    if (booking.status === 'overdue') return true;
    if (booking.status === 'completed' && ['damage', 'fuel_empty', 'dirty_return'].includes(booking.penaltyType || '')) return true;
    return false;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'confirmed': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'upcoming': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'active': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'completed': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50';
      case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'failed': return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'overdue': return 'bg-red-600/20 text-red-600 border-red-600/50';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings;
    if (status === 'upcoming') return bookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed');
    return bookings.filter((b) => b.status === status);
  };

  const BookingCard = ({ booking }: { booking: BookingItem }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.3 }}>
      <Card className="glass-card overflow-hidden border-border/50 hover:border-gold/30 hover:shadow-glow transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-secondary">
              <img src={getCarImage(booking.carId)} alt={booking.car} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{booking.car}</h3>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-right">
                  {booking.penaltyAmount > 0 ? (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Base: <span className="font-medium">${booking.baseCost}</span></p>
                      <p className="text-sm text-destructive">Penalty: <span className="font-bold">+${booking.penaltyAmount}</span></p>
                      <p className="text-xl font-bold text-gold">${booking.baseCost + booking.penaltyAmount}</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-gold">${booking.baseCost}</p>
                    </>
                  )}
                  {booking.refundAmount > 0 && (
                    <div className="mt-1">
                      <p className="text-xs text-green-500">Refund: ${booking.refundAmount} ({booking.refundStatus})</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div><p className="text-muted-foreground">Pickup</p><p className="font-medium">{booking.pickupDate}</p></div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <div><p className="text-muted-foreground">Return</p><p className="font-medium">{booking.returnDate}</p></div>
                </div>
                <div className="flex items-center gap-2 text-sm md:col-span-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div><p className="text-muted-foreground">Location</p><p className="font-medium">{booking.location}</p></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="default" size="sm" className="bg-gradient-gold hover:shadow-glow text-foreground"
                  onClick={() => { setSelectedBooking(booking); setDialogOpen(true); }}>
                  View Details
                </Button>

                {/* Cancel for upcoming/confirmed */}
                {(booking.status === 'upcoming' || booking.status === 'confirmed') && (
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                    onClick={() => handleCancelBooking(booking)}>
                    Cancel Booking
                  </Button>
                )}

                {/* Book Again for all statuses */}
                <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:text-green-400"
                  onClick={() => handleBookAgain(booking)}>
                  <RefreshCw className="w-3 h-3 mr-1" /> Book Again
                </Button>

                {/* Pay Penalty */}
                {showPayPenalty(booking) && (
                  <Button variant="destructive" size="sm" className="flex items-center gap-1"
                    onClick={() => handlePayPenalty(booking)}>
                    <AlertTriangle className="w-3 h-3" /> Pay Penalty (${booking.penaltyAmount})
                  </Button>
                )}
                {booking.penaltyPaid && booking.penaltyAmount > 0 && (
                  <Badge className="bg-green-500/20 text-green-500">Penalty Paid ✅</Badge>
                )}

                {/* Refund badge */}
                {booking.refundStatus === 'refunded' && (
                  <Badge className="bg-green-500/20 text-green-500">Refunded ${booking.refundAmount}</Badge>
                )}
                {booking.refundStatus === 'processing' && (
                  <Badge className="bg-yellow-500/20 text-yellow-500">Refund Processing</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="py-24 relative overflow-hidden"
        style={{
          backgroundImage: theme === 'light'
            ? `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${bookingBg})`
            : `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bookingBg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${theme === 'light' ? 'text-foreground' : 'text-white'}`}>My Bookings</h1>
            <p className={`text-xl max-w-2xl ${theme === 'light' ? 'text-muted-foreground' : 'text-white/90'}`}>
              Track and manage all your car rental bookings
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-6 glass-card p-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-gold text-xs sm:text-sm">All</TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-gradient-gold text-xs sm:text-sm">Upcoming</TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-gradient-gold text-xs sm:text-sm">Active</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-gold text-xs sm:text-sm">Completed</TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-gradient-gold text-xs sm:text-sm">Cancelled</TabsTrigger>
            <TabsTrigger value="overdue" className="data-[state=active]:bg-gradient-gold text-xs sm:text-sm">Overdue</TabsTrigger>
          </TabsList>
          {['all', 'upcoming', 'active', 'completed', 'cancelled', 'overdue'].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              <AnimatePresence>
                {filterBookings(tab).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </AnimatePresence>
              {filterBookings(tab).length === 0 && (
                <div className="text-center py-16">
                  <Car className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No {tab === 'all' ? '' : tab} bookings found</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <BookingDetailsDialog booking={selectedBooking} open={dialogOpen} onOpenChange={setDialogOpen} />

        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your booking for <strong>{bookingToCancel?.car}</strong>?
                <br /><br />
                <span className="text-destructive font-medium">A 10% cancellation fee (${bookingToCancel ? Math.round(bookingToCancel.baseCost * 0.10) : 0}) will be deducted.</span>
                <br />
                <span className="text-green-500">You will be refunded ${bookingToCancel ? bookingToCancel.baseCost - Math.round(bookingToCancel.baseCost * 0.10) : 0}.</span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Keep Booking</Button>
              <Button variant="destructive" onClick={confirmCancel}>Yes, Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyBookings;
