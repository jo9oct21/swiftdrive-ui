import { motion } from 'framer-motion';
import { Car, Users, BookOpen, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedCounter from '@/components/AnimatedCounter';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { title: 'Total Revenue', value: 45231, icon: DollarSign, prefix: '$', color: 'text-green-500', bg: 'bg-green-500/10' },
  { title: 'Total Cars', value: 127, icon: Car, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { title: 'Active Users', value: 1834, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { title: 'Bookings', value: 892, icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

const recentBookings = [
  { id: 1, car: 'Tesla Model 3', user: 'John Doe', date: '2025-10-22', status: 'Active' },
  { id: 2, car: 'BMW X5', user: 'Jane Smith', date: '2025-10-23', status: 'Pending' },
  { id: 3, car: 'Porsche 911', user: 'Mike Johnson', date: '2025-10-24', status: 'Active' },
  { id: 4, car: 'Mercedes C-Class', user: 'Sarah Wilson', date: '2025-10-25', status: 'Completed' },
];

const pieData = [
  { name: 'SUV', value: 35, color: 'hsl(221, 83%, 53%)' },
  { name: 'Sedan', value: 30, color: 'hsl(195, 100%, 50%)' },
  { name: 'Sports', value: 15, color: 'hsl(43, 96%, 56%)' },
  { name: 'Electric', value: 20, color: 'hsl(142, 76%, 36%)' },
];

const bookingStatusData = [
  { status: 'Active', count: 45 },
  { status: 'Pending', count: 23 },
  { status: 'Completed', count: 180 },
  { status: 'Cancelled', count: 12 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gradient mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Welcome back, Admin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="glass-card hover-glow border-border/50 hover:border-primary/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">
                  <AnimatedCounter end={stat.value} prefix={stat.prefix} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">↑ 12%</span> from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Status Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Booking Status Overview</CardTitle>
              <CardDescription>Current booking distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    <Cell fill="hsl(142, 76%, 36%)" />
                    <Cell fill="hsl(43, 96%, 56%)" />
                    <Cell fill="hsl(221, 83%, 53%)" />
                    <Cell fill="hsl(0, 84%, 60%)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle>Fleet Distribution</CardTitle>
              <CardDescription>Cars by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest rental activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors border border-border/50">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Car className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">{booking.car}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{booking.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-medium">{booking.date}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'Active' ? 'bg-green-500/20 text-green-500'
                      : booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
