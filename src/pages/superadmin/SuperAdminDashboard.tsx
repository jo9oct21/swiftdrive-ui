import { motion } from 'framer-motion';
import { Users, Shield, TrendingUp, BookOpen, DollarSign, Car, AlertTriangle, Calendar, Trophy } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const stats = [
  { title: 'Total Users', value: 1834, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12%' },
  { title: 'Total Admins', value: 5, icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: '+12%' },
  { title: 'Suspended Users', value: 12, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', trend: '-12%' },
  { title: 'Active Bookings', value: 892, icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10', trend: '+12%' },
  { title: 'Total Revenue', value: 284500, icon: DollarSign, color: 'text-gold', bg: 'bg-yellow-500/10', trend: '+12%' },
  { title: 'Fleet Size', value: 156, icon: Car, color: 'text-cyan-500', bg: 'bg-cyan-500/10', trend: '+12%' },
];

const monthlyRevenue = [
  { month: 'Sep', revenue: 12400, bookings: 65 },
  { month: 'Oct', revenue: 18200, bookings: 89 },
  { month: 'Nov', revenue: 15600, bookings: 72 },
  { month: 'Dec', revenue: 22100, bookings: 110 },
  { month: 'Jan', revenue: 19800, bookings: 95 },
  { month: 'Feb', revenue: 24500, bookings: 120 },
];

const userDistribution = [
  { name: 'Active Users', value: 1600, color: '#22c55e' },
  { name: 'Inactive', value: 222, color: '#6b7280' },
  { name: 'Suspended', value: 12, color: '#ef4444' },
];

const bookingsByType = [
  { type: 'SUV', count: 320 },
  { type: 'Sedan', count: 280 },
  { type: 'Sports', count: 150 },
  { type: 'Electric', count: 100 },
  { type: 'Luxury', count: 42 },
];

const topBookers = [
  { name: 'Jane Smith', bookings: 24, spent: 8540, initials: 'JS' },
  { name: 'Mike Johnson', bookings: 19, spent: 6780, initials: 'MJ' },
  { name: 'Sarah Wilson', bookings: 16, spent: 5920, initials: 'SW' },
  { name: 'Alex Brown', bookings: 14, spent: 4850, initials: 'AB' },
  { name: 'Lisa Green', bookings: 12, spent: 4200, initials: 'LG' },
];

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold text-gradient mb-2">Super Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Full system overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
                  {stat.title === 'Total Revenue' ? '$' : ''}<AnimatedCounter end={stat.value} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                    {stat.trend.startsWith('+') ? '↑' : '↓'} {stat.trend}
                  </span> from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Monthly Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> User Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={userDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { icon: TrendingUp, label: 'Revenue Growth', value: '+23.5%', color: 'text-green-500' },
                { icon: Calendar, label: 'Booking Rate', value: '78%', color: 'text-blue-500' },
                { icon: Users, label: 'New Users', value: '+145', color: 'text-purple-500' },
                { icon: Car, label: 'Fleet Utilization', value: '85%', color: 'text-orange-500' },
              ].map((metric, i) => (
                <div key={i} className="text-center p-3 sm:p-4 rounded-xl bg-background/50 border border-border/50">
                  <metric.icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${metric.color}`} />
                  <p className={`text-xl sm:text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top 5 Users & Bookings by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-star-gold" /> Top 5 Bookers</CardTitle>
              <CardDescription>Users with the most bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBookers.map((user, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-gold text-foreground font-bold text-sm">
                      {i + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">{user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.bookings} bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gold text-sm">${user.spent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">total spent</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Car className="h-5 w-5 text-primary" /> Bookings by Car Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingsByType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="hsl(43 96% 56%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
