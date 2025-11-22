import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, DollarSign, Car, User, Mail, Phone } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Booking {
  id: number;
  car: string;
  carImage: string;
  pickupDate: string;
  returnDate: string;
  location: string;
  total: number;
  status: string;
}

interface BookingDetailsDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailsDialog({ booking, open, onOpenChange }: BookingDetailsDialogProps) {
  const { theme } = useTheme();
  if (!booking) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Car Image & Status */}
          <div className="space-y-4">
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={booking.carImage}
                alt={booking.car}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">{booking.car}</h3>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Booking Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gold">Booking Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Pickup Date</p>
                  <p className="font-semibold text-foreground">{booking.pickupDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Return Date</p>
                  <p className="font-semibold text-foreground">{booking.returnDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors md:col-span-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Pickup Location</p>
                  <p className="font-semibold text-foreground">{booking.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-gold/40 bg-gold/10 hover:bg-gold/20 transition-colors md:col-span-2">
                <DollarSign className="h-5 w-5 text-gold mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-gold">${booking.total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gold">Customer Information</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-semibold text-foreground">John Doe</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">john.doe@example.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-semibold text-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking ID */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
            <Car className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <p className="font-mono font-semibold text-foreground">BK-{String(booking.id).padStart(6, '0')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
