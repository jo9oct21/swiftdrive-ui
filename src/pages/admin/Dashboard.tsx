import { motion } from 'framer-motion';
import { Car, Users, BookOpen, DollarSign, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/AnimatedCounter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

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

const monthlyRevenue = [
  { month: 'Sep', revenue: 12400, bookings: 65 },
  { month: 'Oct', revenue: 18200, bookings: 89 },
  { month: 'Nov', revenue: 15600, bookings: 72 },
  { month: 'Dec', revenue: 22100, bookings: 110 },
  { month: 'Jan', revenue: 19800, bookings: 95 },
  { month: 'Feb', revenue: 24500, bookings: 120 },
];

const bookingStatusData = [
  { status: 'Active', count: 45 },
  { status: 'Pending', count: 23 },
  { status: 'Completed', count: 180 },
  { status: 'Cancelled', count: 12 },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="glass-card hover-glow border-border/50 hover:border-primary/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
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
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue and bookings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(221, 83%, 53%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Booking Status Bar Chart + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Booking Status Overview</CardTitle>
              <CardDescription>Current booking distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
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

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest rental activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Car className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.car}</p>
                        <p className="text-sm text-muted-foreground">{booking.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{booking.date}</p>
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

      {/* Quick Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: TrendingUp, label: 'Revenue Growth', value: '+23.5%', color: 'text-green-500' },
                { icon: Calendar, label: 'Booking Rate', value: '78%', color: 'text-blue-500' },
                { icon: Users, label: 'New Users', value: '+145', color: 'text-purple-500' },
                { icon: Car, label: 'Fleet Utilization', value: '85%', color: 'text-orange-500' },
              ].map((metric, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-background/50 border border-border/50">
                  <metric.icon className={`w-8 h-8 mx-auto mb-2 ${metric.color}`} />
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
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
