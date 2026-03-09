import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Filter, X, AlertTriangle, CheckCircle, XCircle, DollarSign } from 'lucide-react';
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
import { useBookingStore } from '@/stores/useBookingStore';

const penaltyTypes = [
  { id: 'damage', label: 'Vehicle Damage', amount: 200 },
  { id: 'fuel_empty', label: 'Empty Fuel Tank', amount: 40 },
  { id: 'dirty_return', label: 'Dirty Vehicle', amount: 25 },
];

const ManageBookings = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);
  const [completeMethodDialogOpen, setCompleteMethodDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedPenalty, setSelectedPenalty] = useState('');
  const { addNotification } = useNotifications();

  const {
    bookings,
    completeBooking,
    completeByOtherMethod,
    allowBooking,
    rejectBooking,
    applyAdminPenalty,
    applyOverduePenalty,
  } = useBookingStore();

  const handleCompleteBooking = (id: number) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    // Overdue with unpaid penalty — can't complete normally
    if (booking.status.toLowerCase() === 'overdue' && !booking.penaltyPaid) {
      // Show option to complete by other method
      setSelectedBookingId(id);
      setCompleteMethodDialogOpen(true);
      return;
    }

    const success = completeBooking(id);
    if (success) {
      addNotification({ title: 'Booking Completed', message: `Your booking for ${booking.car} has been marked as completed.`, type: 'success' });
      toast({ title: "Booking Completed", description: "The booking status has been updated to completed." });
    }
  };

  const handleCompleteByOtherMethod = () => {
    if (!selectedBookingId) return;
    const booking = bookings.find(b => b.id === selectedBookingId);
    completeByOtherMethod(selectedBookingId);
    addNotification({ title: 'Booking Completed', message: `Your booking for ${booking?.car} has been marked as completed. Penalty paid by other method.`, type: 'success' });
    toast({ title: "Booking Completed", description: "Marked as completed with penalty paid by other method." });
    setCompleteMethodDialogOpen(false);
  };

  const handleAllowBooking = (id: number) => {
    const booking = bookings.find(b => b.id === id);
    allowBooking(id);
    addNotification({ title: 'Car Delivered', message: `The car ${booking?.car} has been delivered. Rental is now active.`, type: 'success' });
    toast({ title: "Booking Activated", description: "Car delivered successfully. Booking is now active." });
  };

  const handleRejectBooking = (id: number) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    rejectBooking(id);
    addNotification({ title: 'Booking Rejected', message: `Your booking for ${booking.car} was rejected. Full refund of $${booking.baseCost} is being processed.`, type: 'warning' });
    toast({ title: "Booking Rejected", description: `Full refund of $${booking.baseCost} being processed for ${booking.user}.` });
  };

  const handleAddPenalty = () => {
    if (!selectedBookingId || !selectedPenalty) return;
    const penalty = penaltyTypes.find(p => p.id === selectedPenalty);
    const booking = bookings.find(b => b.id === selectedBookingId);
    if (!penalty || !booking) return;

    applyAdminPenalty(selectedBookingId, selectedPenalty, penalty.amount);

    addNotification({
      title: `Penalty Applied: ${penalty.label}`,
      message: `A ${penalty.label} penalty of $${penalty.amount} has been applied to your booking for ${booking.car}. Total: $${booking.baseCost + penalty.amount}`,
      type: 'penalty',
    });
    toast({ title: "Penalty Applied", description: `${penalty.label} penalty of $${penalty.amount} has been added and user notified.` });
    setPenaltyDialogOpen(false);
    setSelectedPenalty('');
  };

  const handleAddOverduePenalty = (id: number) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    applyOverduePenalty(id);

    const now = new Date();
    const endDate = new Date(booking.returnDate);
    const daysLate = Math.max(1, Math.ceil((now.getTime() - endDate.getTime()) / 86400000));
    const totalPenalty = daysLate * 50;

    addNotification({
      title: 'Overdue Penalty Updated',
      message: `Your overdue penalty for ${booking.car} is now $${totalPenalty} (${daysLate} days × $50/day).`,
      type: 'penalty',
    });
    toast({ title: "Penalty Updated", description: `Overdue penalty set to $${totalPenalty} for ${daysLate} late days.` });
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    const styles: Record<string, string> = {
      active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      pending: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
      upcoming: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
      overdue: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
      failed: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30',
      cancelled: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
      completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    };
    return styles[s] || 'bg-muted text-muted-foreground';
  };

  const filteredBookings = bookings.filter((booking) => {
    const statusStr = booking.status.toLowerCase();
    const matchesSearch =
      booking.user.toLowerCase().includes(search.toLowerCase()) ||
      booking.car.toLowerCase().includes(search.toLowerCase()) ||
      statusStr.includes(search.toLowerCase());
    const matchesStatus = !statusFilter || statusStr === statusFilter.toLowerCase();
    const matchesDateRange =
      (!dateRange.from || new Date(booking.pickupDate) >= dateRange.from) &&
      (!dateRange.to || new Date(booking.returnDate) <= dateRange.to);
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
              {['Active', 'Upcoming', 'Completed', 'Pending', 'Overdue', 'Failed', 'Cancelled'].map(s => (
                <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>{s}</DropdownMenuItem>
              ))}
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
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
              <TableRow key={booking.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium text-foreground">#{booking.id}</TableCell>
                <TableCell className="text-foreground">{booking.user}</TableCell>
                <TableCell className="text-foreground">{booking.car}</TableCell>
                <TableCell className="hidden sm:table-cell text-foreground">{booking.pickupDate}</TableCell>
                <TableCell className="hidden sm:table-cell text-foreground">{booking.returnDate}</TableCell>
                <TableCell className="hidden md:table-cell font-medium text-foreground">${booking.baseCost}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {booking.penaltyAmount > 0 ? (
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      +${booking.penaltyAmount}
                      {booking.penaltyPaid && <span className="text-emerald-600 dark:text-emerald-400 text-xs ml-1">✅</span>}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {penaltyTypes.find(p => p.id === booking.penaltyType)?.label || (booking.penaltyType === 'late_return' ? 'Late Return (auto)' : '')}
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="font-bold text-foreground">${booking.baseCost + booking.penaltyAmount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('text-xs', getStatusBadge(booking.status))}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {booking.status === 'active' && (
                      <>
                        <Button size="sm" variant="outline" className="text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleCompleteBooking(booking.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Complete
                        </Button>
                        {!booking.penaltyType && (
                          <Button size="sm" variant="outline" className="text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-600 hover:text-white transition-colors"
                            onClick={() => { setSelectedBookingId(booking.id); setPenaltyDialogOpen(true); }}>
                            <AlertTriangle className="h-3 w-3 mr-1" /> Penalty
                          </Button>
                        )}
                      </>
                    )}
                    {booking.status === 'overdue' && (
                      <>
                        <Button size="sm" variant="outline" className="text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-600 hover:text-white transition-colors"
                          onClick={() => handleAddOverduePenalty(booking.id)}>
                          <DollarSign className="h-3 w-3 mr-1" /> Update Penalty
                        </Button>
                        <Button size="sm" variant="outline"
                          className={cn(
                            'transition-colors',
                            !booking.penaltyPaid 
                              ? 'opacity-40 cursor-not-allowed text-muted-foreground' 
                              : 'text-foreground hover:bg-primary hover:text-primary-foreground'
                          )}
                          onClick={() => handleCompleteBooking(booking.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Complete
                        </Button>
                      </>
                    )}
                    {booking.status === 'upcoming' && (
                      <>
                        <Button size="sm" variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-colors"
                          onClick={() => handleAllowBooking(booking.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Allow
                        </Button>
                        <Button size="sm" variant="outline" className="text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-600 hover:text-white transition-colors"
                          onClick={() => handleRejectBooking(booking.id)}>
                          <XCircle className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    {!booking.penaltyType && booking.status === 'completed' && (
                      <Button size="sm" variant="outline" className="text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-600 hover:text-white transition-colors"
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

      {/* Penalty Dialog */}
      <Dialog open={penaltyDialogOpen} onOpenChange={setPenaltyDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" /> Apply Penalty
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select the type of penalty to apply. The user will be notified and must pay before completion.</p>
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
            <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleAddPenalty} disabled={!selectedPenalty}>Apply Penalty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete By Other Method Dialog */}
      <Dialog open={completeMethodDialogOpen} onOpenChange={setCompleteMethodDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Complete Overdue Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This booking has an unpaid penalty. You can mark it as completed with the note that penalty was paid by another method (cash, bank transfer, etc.).
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCompleteMethodDialogOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleCompleteByOtherMethod}>
              Complete (Paid by Other Method)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBookings;
