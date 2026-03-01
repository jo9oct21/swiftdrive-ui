import { motion } from 'framer-motion';
import { Users, Shield, TrendingUp, BookOpen, DollarSign, Car, AlertTriangle } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const stats = [
  { title: 'Total Users', value: 1834, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { title: 'Total Admins', value: 5, icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { title: 'Suspended Users', value: 12, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
  { title: 'Active Bookings', value: 892, icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10' },
  { title: 'Total Revenue', value: 284500, icon: DollarSign, color: 'text-gold', bg: 'bg-yellow-500/10' },
  { title: 'Fleet Size', value: 156, icon: Car, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
];

const revenueData = [
  { month: 'Sep', revenue: 32000, bookings: 120 },
  { month: 'Oct', revenue: 38000, bookings: 145 },
  { month: 'Nov', revenue: 42000, bookings: 160 },
  { month: 'Dec', revenue: 55000, bookings: 210 },
  { month: 'Jan', revenue: 48000, bookings: 185 },
  { month: 'Feb', revenue: 52000, bookings: 195 },
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

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Full system overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                  {stat.title === 'Total Revenue' ? '$' : ''}<AnimatedCounter end={stat.value} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(43 96% 56%)" fill="hsl(43 96% 56% / 0.2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={userDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
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
    </div>
  );
};

export default SuperAdminDashboard;
