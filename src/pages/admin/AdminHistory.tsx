import { motion } from 'framer-motion';
import { Calendar, DollarSign, Car, Users, TrendingUp, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const monthlyData = [
  {
    month: 'February 2025',
    totalBookings: 120,
    totalRevenue: 24500,
    newUsers: 45,
    carsBooked: 87,
    topCar: 'Tesla Model 3',
    cancelledBookings: 8,
    completedBookings: 98,
    pendingBookings: 14,
  },
  {
    month: 'January 2025',
    totalBookings: 95,
    totalRevenue: 19800,
    newUsers: 38,
    carsBooked: 72,
    topCar: 'BMW X5',
    cancelledBookings: 5,
    completedBookings: 82,
    pendingBookings: 8,
  },
  {
    month: 'December 2024',
    totalBookings: 110,
    totalRevenue: 22100,
    newUsers: 52,
    carsBooked: 95,
    topCar: 'Porsche 911',
    cancelledBookings: 12,
    completedBookings: 90,
    pendingBookings: 8,
  },
  {
    month: 'November 2024',
    totalBookings: 72,
    totalRevenue: 15600,
    newUsers: 28,
    carsBooked: 58,
    topCar: 'Mercedes C-Class',
    cancelledBookings: 6,
    completedBookings: 60,
    pendingBookings: 6,
  },
  {
    month: 'October 2024',
    totalBookings: 89,
    totalRevenue: 18200,
    newUsers: 35,
    carsBooked: 67,
    topCar: 'Tesla Model 3',
    cancelledBookings: 7,
    completedBookings: 75,
    pendingBookings: 7,
  },
  {
    month: 'September 2024',
    totalBookings: 65,
    totalRevenue: 12400,
    newUsers: 22,
    carsBooked: 50,
    topCar: 'BMW X5',
    cancelledBookings: 4,
    completedBookings: 55,
    pendingBookings: 6,
  },
];

const AdminHistory = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">History</h1>
        <p className="text-muted-foreground">Monthly records and performance overview</p>
      </div>

      <div className="space-y-8">
        {monthlyData.map((data, idx) => (
          <motion.div
            key={data.month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    {data.month}
                  </CardTitle>
                  <Badge variant="outline" className="text-gold border-gold">
                    {data.totalBookings} Bookings
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold text-green-500">${data.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                    <Car className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold text-blue-500">{data.carsBooked}</p>
                    <p className="text-xs text-muted-foreground">Cars Booked</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold text-purple-500">+{data.newUsers}</p>
                    <p className="text-xs text-muted-foreground">New Users</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold text-orange-500">{data.topCar}</p>
                    <p className="text-xs text-muted-foreground">Top Car</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
                    <BookOpen className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-semibold text-green-500">{data.completedBookings}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10">
                    <BookOpen className="w-4 h-4 text-yellow-500" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-500">{data.pendingBookings}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10">
                    <BookOpen className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-sm font-semibold text-red-500">{data.cancelledBookings}</p>
                      <p className="text-xs text-muted-foreground">Cancelled</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminHistory;
