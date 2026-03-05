import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Filter, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/contexts/NotificationContext';

const penaltyTypes = [
  { id: 'damage', label: 'Vehicle Damage', amount: 200 },
  { id: 'fuel_empty', label: 'Empty Fuel Tank', amount: 40 },
  { id: 'dirty_return', label: 'Dirty Vehicle', amount: 25 },
];

const demoBookings = [
  { id: 1, user: 'John Doe', car: 'Tesla Model 3', startDate: '2025-10-22', endDate: '2025-10-25', baseCost: 267, penaltyAmount: 0, penaltyPaid: false, status: 'Active', penalty: null as string | null },
  { id: 2, user: 'Jane Smith', car: 'BMW X5', startDate: '2025-10-23', endDate: '2025-10-27', baseCost: 500, penaltyAmount: 0, penaltyPaid: false, status: 'Pending', penalty: null as string | null },
  { id: 3, user: 'Mike Johnson', car: 'Porsche 911', startDate: '2025-10-20', endDate: '2025-10-22', baseCost: 548, penaltyAmount: 200, penaltyPaid: false, status: 'Completed', penalty: 'damage' },
  { id: 4, user: 'Sarah Wilson', car: 'Mercedes C-Class', startDate: '2025-10-24', endDate: '2025-10-28', baseCost: 380, penaltyAmount: 0, penaltyPaid: false, status: 'Active', penalty: null as string | null },
  { id: 5, user: 'Alex Brown', car: 'Audi Q7', startDate: '2025-10-26', endDate: '2025-10-30', baseCost: 460, penaltyAmount: 0, penaltyPaid: false, status: 'Upcoming', penalty: null as string | null },
  { id: 6, user: 'Lisa Green', car: 'Toyota Camry', startDate: '2025-10-15', endDate: '2025-10-18', baseCost: 195, penaltyAmount: 50, penaltyPaid: false, status: 'Overdue', penalty: 'late_return' },
];

const ManageBookings = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [bookings, setBookings] = useState(demoBookings);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedPenalty, setSelectedPenalty] = useState('');
  const { addNotification } = useNotifications();

  const handleCompleteBooking = (id: number) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    // If overdue and penalty not paid, block completion
    if (booking.status === 'Overdue' && !booking.penaltyPaid) {
      toast({ title: "Cannot Complete", description: "User must pay the penalty before completing this booking.", variant: 'destructive' });
      return;
    }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Completed' } : b));
    addNotification({ title: 'Booking Completed', message: `Your booking for ${booking.car} has been marked as completed.`, type: 'success' });
    toast({ title: "Booking Completed", description: "The booking status has been updated to completed." });
  };

  const handleAllowBooking = (id: number) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Active' } : b));
    const booking = bookings.find(b => b.id === id);
    addNotification({ title: 'Car Delivered', message: `The car ${booking?.car} has been delivered to ${booking?.user}. Rental is now active.`, type: 'success' });
    toast({ title: "Booking Activated", description: "Car delivered successfully. Booking is now active." });
  };

  const handleRejectBooking = (id: number) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    const refund = booking.baseCost;
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Failed', penaltyAmount: 0 } : b));
    addNotification({ title: 'Booking Rejected', message: `Your booking for ${booking.car} was rejected. Full refund of $${refund} is being processed.`, type: 'warning' });
    toast({ title: "Booking Rejected", description: `Full refund of $${refund} being processed for ${booking.user}.` });
  };

  const handleAddPenalty = () => {
    if (!selectedBookingId || !selectedPenalty) return;
    const penalty = penaltyTypes.find(p => p.id === selectedPenalty);
    const booking = bookings.find(b => b.id === selectedBookingId);
    setBookings(prev => prev.map(b =>
      b.id === selectedBookingId ? { ...b, penalty: selectedPenalty, penaltyAmount: penalty?.amount || 0 } : b
    ));
    addNotification({
      title: `Penalty Applied: ${penalty?.label}`,
      message: `A ${penalty?.label} penalty of $${penalty?.amount} has been applied to your booking for ${booking?.car}. Total: $${(booking?.baseCost || 0) + (penalty?.amount || 0)}`,
      type: 'penalty',
    });
    toast({ title: "Penalty Applied", description: `${penalty?.label} penalty of $${penalty?.amount} has been added and user notified.` });
    setPenaltyDialogOpen(false);
    setSelectedPenalty('');
  };

  const handleAddOverduePenalty = (id: number) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    const now = new Date();
    const endDate = new Date(booking.endDate);
    const daysLate = Math.max(1, Math.ceil((now.getTime() - endDate.getTime()) / 86400000));
    const penaltyPerDay = 50;
    const totalPenalty = daysLate * penaltyPerDay;
    setBookings(prev => prev.map(b => b.id === id ? { ...b, penaltyAmount: totalPenalty, penalty: 'late_return' } : b));
    addNotification({
      title: 'Overdue Penalty Updated',
      message: `Your overdue penalty for ${booking.car} is now $${totalPenalty} (${daysLate} days × $${penaltyPerDay}/day).`,
      type: 'penalty',
    });
    toast({ title: "Penalty Updated", description: `Overdue penalty set to $${totalPenalty} for ${daysLate} late days.` });
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user.toLowerCase().includes(search.toLowerCase()) ||
      booking.car.toLowerCase().includes(search.toLowerCase()) ||
      booking.status.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesDateRange =
      (!dateRange.from || new Date(booking.startDate) >= dateRange.from) &&
      (!dateRange.to || new Date(booking.endDate) <= dateRange.to);
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const clearFilters = () => {
    setStatusFilter(null);
    setDateRange({ from: undefined, to: undefined });
    setSearch('');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gradient mb-2">Manage Bookings</h1>
          <p className="text-muted-foreground text-sm sm:text-base">View and manage all rental bookings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" /> {statusFilter || 'Filter'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('Active')}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Upcoming')}>Upcoming</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Completed')}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Overdue')}>Overdue</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Failed')}>Failed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Cancelled')}>Cancelled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{dateRange.from ? (dateRange.to ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}` : format(dateRange.from, 'MMM d, yyyy')) : 'Date Range'}</span>
                <span className="sm:hidden">Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent mode="range" selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })} numberOfMonths={2} className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>

          {(statusFilter || dateRange.from || search) && (
            <Button variant="ghost" size="icon" onClick={clearFilters}><X className="h-5 w-5" /></Button>
          )}
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search by user, car name or status..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Car</TableHead>
              <TableHead className="hidden sm:table-cell">Start Date</TableHead>
              <TableHead className="hidden sm:table-cell">End Date</TableHead>
              <TableHead className="hidden md:table-cell">Base Cost</TableHead>
              <TableHead className="hidden md:table-cell">Penalty</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">#{booking.id}</TableCell>
                <TableCell>{booking.user}</TableCell>
                <TableCell>{booking.car}</TableCell>
                <TableCell className="hidden sm:table-cell">{booking.startDate}</TableCell>
                <TableCell className="hidden sm:table-cell">{booking.endDate}</TableCell>
                <TableCell className="hidden md:table-cell font-medium">${booking.baseCost}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {booking.penaltyAmount > 0 ? (
                    <span className="text-destructive font-bold">
                      +${booking.penaltyAmount}
                      <span className="block text-xs font-normal">
                        {penaltyTypes.find(p => p.id === booking.penalty)?.label || (booking.penalty === 'late_return' ? 'Late Return (auto)' : '')}
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="font-bold">${booking.baseCost + booking.penaltyAmount}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                    booking.status === 'Active' ? 'bg-green-500/20 text-green-500'
                    : booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500'
                    : booking.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-500'
                    : booking.status === 'Overdue' ? 'bg-red-600/20 text-red-600'
                    : booking.status === 'Failed' ? 'bg-orange-500/20 text-orange-500'
                    : booking.status === 'Cancelled' ? 'bg-red-500/20 text-red-500'
                    : 'bg-emerald-500/20 text-emerald-500'
                  }`}>
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {booking.status === 'Active' && (
                      <Button size="sm" variant="outline" onClick={() => handleCompleteBooking(booking.id)}>
                        Complete
                      </Button>
                    )}
                    {booking.status === 'Overdue' && (
                      <>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => handleAddOverduePenalty(booking.id)}>
                          <AlertTriangle className="h-3 w-3 mr-1" /> Penalty
                        </Button>
                        <Button size="sm" variant="outline"
                          className={!booking.penaltyPaid ? 'opacity-50 cursor-not-allowed' : ''}
                          onClick={() => handleCompleteBooking(booking.id)}
                          disabled={!booking.penaltyPaid}>
                          Complete
                        </Button>
                      </>
                    )}
                    {booking.status === 'Upcoming' && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-500 border-green-500/30 hover:bg-green-500/10"
                          onClick={() => handleAllowBooking(booking.id)}>
                          Allow
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => handleRejectBooking(booking.id)}>
                          Reject
                        </Button>
                      </>
                    )}
                    {!booking.penalty && (booking.status === 'Active' || booking.status === 'Completed') && (
                      <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => { setSelectedBookingId(booking.id); setPenaltyDialogOpen(true); }}>
                        <AlertTriangle className="h-3 w-3 mr-1" /> Penalty
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={penaltyDialogOpen} onOpenChange={setPenaltyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Apply Penalty
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select the type of penalty to apply. The user will be notified.</p>
            <Select value={selectedPenalty} onValueChange={setSelectedPenalty}>
              <SelectTrigger><SelectValue placeholder="Select penalty type" /></SelectTrigger>
              <SelectContent>
                {penaltyTypes.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.label} — ${p.amount}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPenaltyDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleAddPenalty} disabled={!selectedPenalty}>Apply Penalty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBookings;
