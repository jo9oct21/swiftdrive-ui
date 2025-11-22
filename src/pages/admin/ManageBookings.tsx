import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const demoBookings = [
  {
    id: 1,
    user: 'John Doe',
    car: 'Tesla Model 3',
    startDate: '2025-10-22',
    endDate: '2025-10-25',
    total: 267,
    status: 'Active',
  },
  {
    id: 2,
    user: 'Jane Smith',
    car: 'BMW X5',
    startDate: '2025-10-23',
    endDate: '2025-10-27',
    total: 500,
    status: 'Pending',
  },
  {
    id: 3,
    user: 'Mike Johnson',
    car: 'Porsche 911',
    startDate: '2025-10-20',
    endDate: '2025-10-22',
    total: 598,
    status: 'Completed',
  },
  {
    id: 4,
    user: 'Sarah Wilson',
    car: 'Mercedes C-Class',
    startDate: '2025-10-24',
    endDate: '2025-10-28',
    total: 380,
    status: 'Active',
  },
];

const ManageBookings = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [bookings, setBookings] = useState(demoBookings);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const handleCompleteBooking = (id: number) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === id ? { ...booking, status: 'Completed' } : booking
      )
    );
    toast({
      title: "Booking Completed",
      description: "The booking status has been updated to completed.",
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    // Search filter
    const matchesSearch =
      booking.user.toLowerCase().includes(search.toLowerCase()) ||
      booking.car.toLowerCase().includes(search.toLowerCase()) ||
      booking.startDate.includes(search) ||
      booking.endDate.includes(search) ||
      booking.total.toString().includes(search);

    // Status filter
    const matchesStatus = !statusFilter || booking.status === statusFilter;

    // Date range filter
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
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-5 h-5 mr-2" />
                {statusFilter || 'Filter'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('Active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar className="w-5 h-5 mr-2" />
                {dateRange.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
                  ) : (
                    format(dateRange.from, 'MMM d, yyyy')
                  )
                ) : (
                  'Date Range'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {(statusFilter || dateRange.from || search) && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search bookings..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-lg overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Car</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
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
                <TableCell>{booking.startDate}</TableCell>
                <TableCell>{booking.endDate}</TableCell>
                <TableCell className="font-bold">${booking.total}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'Active'
                        ? 'bg-green-500/20 text-green-500'
                        : booking.status === 'Pending'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-blue-500/20 text-blue-500'
                    }`}
                  >
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell>
                  {booking.status === 'Active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCompleteBooking(booking.id)}
                    >
                      Complete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default ManageBookings;
