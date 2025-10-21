import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Filter } from 'lucide-react';
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

  const filteredBookings = demoBookings.filter(
    (booking) =>
      booking.user.toLowerCase().includes(search.toLowerCase()) ||
      booking.car.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Manage Bookings</h1>
          <p className="text-muted-foreground">View and manage all rental bookings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Calendar className="w-5 h-5 mr-2" />
            Date Range
          </Button>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default ManageBookings;
