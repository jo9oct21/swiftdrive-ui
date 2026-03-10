import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Car, DollarSign, Clock, AlertTriangle, RefreshCw, Eye } from 'lucide-react';
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
import { useBookingStore, BookingItem } from '@/stores/useBookingStore';
import { useCarStore } from '@/stores/useCarStore';
import { BookingDetailsDialog } from '@/components/BookingDetailsDialog';

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'overdue', label: 'Overdue' },
];

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<BookingItem | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { addNotification } = useNotifications();

  const { getBookingsForUser, cancelBooking, payPenalty, runStateMachine, getOverduePenalty } = useBookingStore();
  const { cars } = useCarStore();

  const bookings = getBookingsForUser(user?.email || '');

  useEffect(() => {
    if (!isAuthenticated) {
      toast({ title: 'Authentication required', description: 'Please login to view your bookings', variant: 'destructive' });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  // Run state machine on mount and every 60s
  useEffect(() => {
    runStateMachine();
    const interval = setInterval(runStateMachine, 30000);
    return () => clearInterval(interval);
  }, [runStateMachine]);

  // Send daily overdue notifications
  useEffect(() => {
    const overdueBookings = bookings.filter(b => b.status === 'overdue' && !b.penaltyPaid);
    overdueBookings.forEach(b => {
      const { days, amount } = getOverduePenalty(b);
      const notifKey = `overdue_notif_${b.id}_${days}`;
      if (!sessionStorage.getItem(notifKey)) {
        addNotification({
          title: `Overdue Penalty — Day ${days}`,
          message: `Your booking for ${b.car} is ${days} day(s) overdue. Current penalty: $${amount}. Please return the car and pay the penalty.`,
          type: 'penalty',
        });
        sessionStorage.setItem(notifKey, 'true');
      }
    });
  }, [bookings, getOverduePenalty, addNotification]);

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
      cancelBooking(bookingToCancel.id);
      const cancellationPenalty = Math.round(bookingToCancel.baseCost * 0.10);
      const refund = bookingToCancel.baseCost - cancellationPenalty;
      addNotification({ title: 'Booking Cancelled', message: `Your booking for ${bookingToCancel.car} has been cancelled. 10% fee ($${cancellationPenalty}) applied. Refund: $${refund}.`, type: 'warning' });
      toast({ title: 'Booking Cancelled', description: `Refund of $${refund} processed. 10% penalty ($${cancellationPenalty}) applied.` });
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const handleBookAgain = (booking: BookingItem) => {
    const carData = cars.find(c => c.id === booking.carId);
    if (!carData) { navigate('/cars'); return; }
    if (booking.status === 'active' || booking.status === 'upcoming') {
      navigate('/booking', { state: { car: carData, startFromDate: booking.returnDate } });
    } else {
      navigate('/booking', { state: { car: carData } });
    }
  };

  const handlePayPenalty = (booking: BookingItem) => {
    // Get current real-time penalty for overdue
    const currentAmount = booking.status === 'overdue' ? getOverduePenalty(booking).amount : booking.penaltyAmount;
    toast({ title: 'Processing Payment 💳', description: `Processing penalty payment of $${currentAmount} for ${booking.car}...` });
    setTimeout(() => {
      payPenalty(booking.id);
      addNotification({ title: 'Penalty Paid', message: `Your penalty of $${currentAmount} for ${booking.car} has been paid successfully.`, type: 'success' });
      toast({ title: 'Penalty Paid! ✅', description: `$${currentAmount} penalty for ${booking.car} has been paid.` });
    }, 2000);
  };

  const showPayPenalty = (booking: BookingItem) => {
    if (booking.penaltyPaid || booking.status === 'completed') return false;
    if (booking.status === 'overdue') return true;
    if (booking.penaltyAmount > 0 && booking.penaltyType && booking.penaltySource === 'admin') return true;
    return false;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30';
      case 'upcoming': return 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30';
      case 'active': return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30';
      case 'cancelled': return 'bg-slate-500/20 text-slate-600 dark:text-slate-300 border-slate-500/30';
      case 'failed': return 'bg-orange-500/20 text-orange-600 dark:text-orange-300 border-orange-500/30';
      case 'overdue': return 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings;
    if (status === 'upcoming') return bookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed');
    return bookings.filter((b) => b.status === status);
  };

  const BookingCard = ({ booking }: { booking: BookingItem }) => {
    const overdue = getOverduePenalty(booking);
    const displayPenalty = booking.status === 'overdue' && !booking.penaltyPaid ? overdue.amount : booking.penaltyAmount;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.3 }}>
        <Card className="overflow-hidden border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-secondary">
                <img src={getCarImage(booking.carId)} alt={booking.car} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">{booking.car}</h3>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-left sm:text-right">
                    {displayPenalty > 0 ? (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Base: <span className="font-medium">${booking.baseCost}</span></p>
                        <p className="text-sm text-amber-600 dark:text-amber-300 font-semibold">
                          Penalty: +${displayPenalty}
                          {booking.status === 'overdue' && <span className="text-xs ml-1">({overdue.days}d × $50)</span>}
                        </p>
                        <p className="text-xl font-bold text-primary">${booking.baseCost + displayPenalty}</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-primary">${booking.baseCost}</p>
                      </>
                    )}
                    {booking.refundAmount > 0 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-1 font-medium">Refund: ${booking.refundAmount} ({booking.refundStatus})</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <div><p className="text-muted-foreground">Pickup</p><p className="font-medium text-foreground">{booking.pickupDate}</p></div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <div><p className="text-muted-foreground">Return</p><p className="font-medium text-foreground">{booking.returnDate}</p></div>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:col-span-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <div><p className="text-muted-foreground">Location</p><p className="font-medium text-foreground">{booking.location}</p></div>
                  </div>
                </div>

                {/* Penalty info banner */}
                {displayPenalty > 0 && !booking.penaltyPaid && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-300 flex-shrink-0" />
                    <p className="text-sm text-amber-700 dark:text-amber-200">
                      <span className="font-semibold">Penalty: ${displayPenalty}</span>
                      {booking.penaltyType === 'late_return' && ` — Overdue ${overdue.days} day(s) at $50/day`}
                      {booking.penaltyType === 'damage' && ' — Vehicle Damage'}
                      {booking.penaltyType === 'fuel_empty' && ' — Empty Fuel Tank'}
                      {booking.penaltyType === 'dirty_return' && ' — Dirty Vehicle'}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => { setSelectedBooking(booking); setDialogOpen(true); }}>
                    <Eye className="w-3 h-3 mr-1" /> View Details
                  </Button>

                  {(booking.status === 'upcoming' || booking.status === 'confirmed') && (
                    <Button size="sm" className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
                      onClick={() => handleCancelBooking(booking)}>
                      Cancel Booking
                    </Button>
                  )}

                  <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleBookAgain(booking)}>
                    <RefreshCw className="w-3 h-3 mr-1" /> Book Again
                  </Button>

                  {showPayPenalty(booking) && (
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => handlePayPenalty(booking)}>
                      <DollarSign className="w-3 h-3 mr-1" /> Pay Penalty (${displayPenalty})
                    </Button>
                  )}
                  {booking.penaltyPaid && booking.penaltyAmount > 0 && (
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30">Penalty Paid ✅</Badge>
                  )}

                  {booking.refundStatus === 'refunded' && (
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30">Refunded ${booking.refundAmount}</Badge>
                  )}
                  {booking.refundStatus === 'processing' && (
                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30">Refund Processing</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

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
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-4 ${theme === 'light' ? 'text-foreground' : 'text-white'}`}>My Bookings</h1>
            <p className={`text-lg sm:text-xl max-w-2xl ${theme === 'light' ? 'text-muted-foreground' : 'text-white/90'}`}>
              Track and manage all your car rental bookings
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {statusTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === tab.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}
            >
              {tab.label}
              <span className="ml-1 text-xs opacity-70">({filterBookings(tab.value).length})</span>
            </button>
          ))}
        </div>

        <div className="space-y-4 sm:space-y-6">
          <AnimatePresence>
            {filterBookings(activeTab).map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </AnimatePresence>
          {filterBookings(activeTab).length === 0 && (
            <div className="text-center py-16">
              <Car className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No {activeTab === 'all' ? '' : activeTab} bookings found</p>
            </div>
          )}
        </div>

        <BookingDetailsDialog booking={selectedBooking} open={dialogOpen} onOpenChange={setDialogOpen} />

        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your booking for <strong>{bookingToCancel?.car}</strong>?
                <br /><br />
                <span className="text-amber-600 dark:text-amber-300 font-medium">A 10% cancellation fee (${bookingToCancel ? Math.round(bookingToCancel.baseCost * 0.10) : 0}) will be deducted.</span>
                <br />
                <span className="text-emerald-600 dark:text-emerald-300">You will be refunded ${bookingToCancel ? bookingToCancel.baseCost - Math.round(bookingToCancel.baseCost * 0.10) : 0}.</span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Keep Booking</Button>
              <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/80" onClick={confirmCancel}>Yes, Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyBookings;
