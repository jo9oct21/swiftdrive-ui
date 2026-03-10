import { useState, useEffect } from 'react';
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
    runStateMachine,
  } = useBookingStore();

  // Run state machine to keep overdue penalties updated
  useEffect(() => {
    runStateMachine();
    const interval = setInterval(runStateMachine, 60000);
    return () => clearInterval(interval);
  }, [runStateMachine]);

  const handleCompleteBooking = (id: number) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    // Overdue with unpaid penalty — offer complete by other method
    if (booking.status === 'overdue' && !booking.penaltyPaid) {
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
    addNotification({ title: 'Booking Rejected & Refunded', message: `Your booking for ${booking.car} was rejected. Full refund of $${booking.baseCost} has been processed.`, type: 'warning' });
    toast({ title: "Booking Rejected", description: `Full refund of $${booking.baseCost} processed for ${booking.user}.` });
  };

  const handleAddPenalty = () => {
    if (!selectedBookingId || !selectedPenalty) return;
    const penalty = penaltyTypes.find(p => p.id === selectedPenalty);
    const booking = bookings.find(b => b.id === selectedBookingId);
    if (!penalty || !booking) return;

    applyAdminPenalty(selectedBookingId, selectedPenalty, penalty.amount);

    addNotification({
      title: `Penalty Applied: ${penalty.label}`,
      message: `A ${penalty.label} penalty of $${penalty.amount} has been applied to your booking for ${booking.car}. Please pay to complete your booking.`,
      type: 'penalty',
    });
    toast({ title: "Penalty Applied", description: `${penalty.label} penalty of $${penalty.amount} has been added and user notified.` });
    setPenaltyDialogOpen(false);
    setSelectedPenalty('');
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    const styles: Record<string, string> = {
      active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      upcoming: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
      overdue: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
      failed: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
      cancelled: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
      completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    };
    return styles[s] || 'bg-muted text-muted-foreground';
  };

  // Only show user bookings (not admin/superadmin)
  const userBookings = bookings.filter(b => 
    !['admin@luxedrive.com', 'superadmin@luxedrive.com'].includes(b.userEmail)
  );

  const filteredBookings = userBookings.filter((booking) => {
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

  const getOverdueDays = (booking: typeof bookings[0]) => {
    if (booking.status !== 'overdue') return 0;
    const now = new Date();
    const endDate = new Date(booking.returnDate);
    return Math.max(1, Math.ceil((now.getTime() - endDate.getTime()) / 86400000));
  };

  // Determine which buttons to show
  const showCompleteBtn = (b: typeof bookings[0]) => b.status === 'active' || b.status === 'overdue';
  const showPenaltyBtn = (b: typeof bookings[0]) => (b.status === 'active' || b.status === 'overdue') && b.status !== 'completed';
  const showAllowBtn = (b: typeof bookings[0]) => b.status === 'upcoming' || b.status === 'pending';
  const showRejectBtn = (b: typeof bookings[0]) => b.status === 'upcoming' || b.status === 'pending';

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">Manage Bookings</h1>
          <p className="text-muted-foreground text-sm sm:text-base">View and manage all user rental bookings</p>
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
              <TableHead className="hidden sm:table-cell">Start</TableHead>
              <TableHead className="hidden sm:table-cell">End</TableHead>
              <TableHead className="hidden md:table-cell">Base Cost</TableHead>
              <TableHead className="hidden md:table-cell">Penalty</TableHead>
              <TableHead className="hidden md:table-cell">Refund</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => {
              const overdueDays = getOverdueDays(booking);
              const effectiveTotal = booking.baseCost - booking.refundAmount + booking.penaltyAmount;

              return (
                <TableRow key={booking.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">#{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground text-sm">{booking.user}</p>
                      <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{booking.car}</TableCell>
                  <TableCell className="hidden sm:table-cell text-foreground text-sm">{booking.pickupDate}</TableCell>
                  <TableCell className="hidden sm:table-cell text-foreground text-sm">{booking.returnDate}</TableCell>
                  <TableCell className="hidden md:table-cell font-medium text-foreground">${booking.baseCost}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {booking.penaltyAmount > 0 ? (
                      <span className="font-semibold text-amber-600 dark:text-amber-300">
                        +${booking.penaltyAmount}
                        {booking.penaltyPaid && <span className="text-emerald-600 dark:text-emerald-300 text-xs ml-1">✅</span>}
                        <span className="block text-xs font-normal text-muted-foreground">
                          {booking.penaltyType === 'late_return' ? `Late (${overdueDays}d × $50)` : penaltyTypes.find(p => p.id === booking.penaltyType)?.label || ''}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {booking.refundAmount > 0 ? (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-300">
                        -${booking.refundAmount}
                        <span className="block text-xs font-normal text-muted-foreground">{booking.refundStatus}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-bold text-foreground">${effectiveTotal}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', getStatusBadge(booking.status))}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {/* Complete button — active & overdue only */}
                      {showCompleteBtn(booking) && (
                        <Button size="sm" variant="outline"
                          className={cn(
                            'transition-colors text-xs',
                            booking.status === 'overdue' && !booking.penaltyPaid
                              ? 'text-foreground hover:bg-primary hover:text-primary-foreground'
                              : 'text-foreground hover:bg-primary hover:text-primary-foreground'
                          )}
                          onClick={() => handleCompleteBooking(booking.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Complete
                        </Button>
                      )}

                      {/* Add Penalty button — active & overdue, NOT completed */}
                      {showPenaltyBtn(booking) && (
                        <Button size="sm" variant="outline"
                          className="text-amber-600 dark:text-amber-300 border-amber-500/30 hover:bg-amber-600 hover:text-white transition-colors text-xs"
                          onClick={() => { setSelectedBookingId(booking.id); setPenaltyDialogOpen(true); }}>
                          <AlertTriangle className="h-3 w-3 mr-1" /> Add Penalty
                        </Button>
                      )}

                      {/* Allow & Reject — upcoming/pending */}
                      {showAllowBtn(booking) && (
                        <Button size="sm" variant="outline"
                          className="text-emerald-600 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-colors text-xs"
                          onClick={() => handleAllowBooking(booking.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Allow
                        </Button>
                      )}
                      {showRejectBtn(booking) && (
                        <Button size="sm" variant="outline"
                          className="text-rose-600 dark:text-rose-300 border-rose-500/30 hover:bg-rose-600 hover:text-white transition-colors text-xs"
                          onClick={() => handleRejectBooking(booking.id)}>
                          <XCircle className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Penalty Dialog */}
      <Dialog open={penaltyDialogOpen} onOpenChange={setPenaltyDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-300" /> Add Penalty
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select the type of penalty to apply. The user will be notified immediately.</p>
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
            <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleAddPenalty} disabled={!selectedPenalty}>Apply Penalty</Button>
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
              This booking has an unpaid overdue penalty. You can:
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Wait for the user to pay the penalty online, then click Complete</li>
              <li>Mark as completed with penalty paid by other method (cash, bank transfer, etc.)</li>
            </ul>
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
