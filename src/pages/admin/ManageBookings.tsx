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

const penaltyTypes = [
  { id: 'late_return', label: 'Late Return', amount: 50 },
  { id: 'no_response', label: 'No Response', amount: 30 },
  { id: 'damage', label: 'Vehicle Damage', amount: 200 },
  { id: 'fuel_empty', label: 'Empty Fuel Tank', amount: 40 },
  { id: 'dirty_return', label: 'Dirty Vehicle', amount: 25 },
];

const demoBookings = [
  { id: 1, user: 'John Doe', car: 'Tesla Model 3', startDate: '2025-10-22', endDate: '2025-10-25', total: 267, status: 'Active', penalty: null as string | null },
  { id: 2, user: 'Jane Smith', car: 'BMW X5', startDate: '2025-10-23', endDate: '2025-10-27', total: 500, status: 'Pending', penalty: null as string | null },
  { id: 3, user: 'Mike Johnson', car: 'Porsche 911', startDate: '2025-10-20', endDate: '2025-10-22', total: 598, status: 'Completed', penalty: 'late_return' },
  { id: 4, user: 'Sarah Wilson', car: 'Mercedes C-Class', startDate: '2025-10-24', endDate: '2025-10-28', total: 380, status: 'Active', penalty: null as string | null },
];

const ManageBookings = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [bookings, setBookings] = useState(demoBookings);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedPenalty, setSelectedPenalty] = useState('');

  const handleCompleteBooking = (id: number) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Completed' } : b));
    toast({ title: "Booking Completed", description: "The booking status has been updated to completed." });
  };

  const handleAddPenalty = () => {
    if (!selectedBookingId || !selectedPenalty) return;
    const penalty = penaltyTypes.find(p => p.id === selectedPenalty);
    setBookings(prev => prev.map(b => 
      b.id === selectedBookingId ? { ...b, penalty: selectedPenalty, total: b.total + (penalty?.amount || 0) } : b
    ));
    toast({ title: "Penalty Applied", description: `${penalty?.label} penalty of $${penalty?.amount} has been added.` });
    setPenaltyDialogOpen(false);
    setSelectedPenalty('');
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user.toLowerCase().includes(search.toLowerCase()) ||
      booking.car.toLowerCase().includes(search.toLowerCase()) ||
      booking.startDate.includes(search) ||
      booking.endDate.includes(search) ||
      booking.total.toString().includes(search);
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Manage Bookings</h1>
          <p className="text-muted-foreground">View and manage all rental bookings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-5 h-5 mr-2" /> {statusFilter || 'Filter'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('Active')}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Completed')}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>Pending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar className="w-5 h-5 mr-2" />
                {dateRange.from ? (dateRange.to ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}` : format(dateRange.from, 'MMM d, yyyy')) : 'Date Range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          {(statusFilter || dateRange.from || search) && (
            <Button variant="ghost" size="icon" onClick={clearFilters}><X className="h-5 w-5" /></Button>
          )}
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search bookings..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Car</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Penalty</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">#{booking.id}</TableCell>
                <TableCell>{booking.user}</TableCell>
                <TableCell>{booking.car}</TableCell>
                <TableCell>{booking.startDate}</TableCell>
                <TableCell>{booking.endDate}</TableCell>
                <TableCell className="font-bold">${booking.total}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === 'Active' ? 'bg-green-500/20 text-green-500'
                    : booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-blue-500/20 text-blue-500'
                  }`}>
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell>
                  {booking.penalty ? (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {penaltyTypes.find(p => p.id === booking.penalty)?.label}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {booking.status === 'Active' && (
                      <Button size="sm" variant="outline" onClick={() => handleCompleteBooking(booking.id)}>
                        Complete
                      </Button>
                    )}
                    {!booking.penalty && (
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

      {/* Penalty Dialog */}
      <Dialog open={penaltyDialogOpen} onOpenChange={setPenaltyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Apply Penalty
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select the type of penalty to apply to this booking.</p>
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
