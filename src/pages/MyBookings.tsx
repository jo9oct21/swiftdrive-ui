import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Car, DollarSign, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import bookingBg from '@/assets/car-sedan.jpg';

const demoBookings = [
  {
    id: 1,
    car: 'Tesla Model 3',
    carImage: '/placeholder.svg',
    pickupDate: '2025-10-22',
    returnDate: '2025-10-25',
    location: 'New York, NY',
    total: 267,
    status: 'upcoming',
  },
  {
    id: 2,
    car: 'BMW X5',
    carImage: '/placeholder.svg',
    pickupDate: '2025-10-23',
    returnDate: '2025-10-27',
    location: 'Los Angeles, CA',
    total: 500,
    status: 'upcoming',
  },
  {
    id: 3,
    car: 'Porsche 911',
    carImage: '/placeholder.svg',
    pickupDate: '2025-10-15',
    returnDate: '2025-10-18',
    location: 'Miami, FL',
    total: 598,
    status: 'completed',
  },
  {
    id: 4,
    car: 'Mercedes C-Class',
    carImage: '/placeholder.svg',
    pickupDate: '2025-10-28',
    returnDate: '2025-10-30',
    location: 'Chicago, IL',
    total: 380,
    status: 'cancelled',
  },
];

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({ 
        title: 'Authentication required', 
        description: 'Please login to view your bookings',
        variant: 'destructive' 
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  if (!isAuthenticated) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const filterBookings = (status: string) => {
    if (status === 'all') return demoBookings;
    return demoBookings.filter((booking) => booking.status === status);
  };

  const BookingCard = ({ booking }: { booking: typeof demoBookings[0] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -8, rotateY: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass-card overflow-hidden border-border/50 hover:border-gold/50 hover:shadow-xl transition-all duration-400">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Car Image */}
            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-secondary">
              <img
                src={booking.carImage}
                alt={booking.car}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Booking Details */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{booking.car}</h3>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-gold">${booking.total}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Pickup</p>
                    <p className="font-medium">{booking.pickupDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Return</p>
                    <p className="font-medium">{booking.returnDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm md:col-span-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{booking.location}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {booking.status === 'upcoming' && (
                  <>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="bg-gradient-to-r from-primary to-accent hover:shadow-glow"
                      onClick={() => navigate(`/car/${booking.id}`)}
                    >
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:border-red-500">
                      Cancel Booking
                    </Button>
                  </>
                )}
                {booking.status === 'completed' && (
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg"
                  >
                    Book Again
                  </Button>
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
      {/* Hero Section */}
      <div 
        className="py-24 relative overflow-hidden"
        style={{
          backgroundImage: theme === 'light' 
            ? `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${bookingBg})`
            : `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bookingBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${
              theme === 'light' ? 'text-foreground' : 'text-white'
            }`}>My Bookings</h1>
            <p className={`text-xl max-w-2xl ${
              theme === 'light' ? 'text-muted-foreground' : 'text-white/90'
            }`}>
              Track and manage all your car rental bookings
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 glass-card p-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-gold">
              All
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-gradient-gold">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-gold">
              Completed
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-gradient-gold">
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filterBookings('all').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            {filterBookings('upcoming').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {filterBookings('completed').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            {filterBookings('cancelled').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyBookings;
