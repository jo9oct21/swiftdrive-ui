import { motion } from 'framer-motion';
import { Car, Users, BookOpen, DollarSign, TrendingUp, Calendar, Home } from 'lucide-react';
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

const stats = [
  { title: 'Total Revenue', value: 45231, icon: DollarSign, prefix: '$', color: 'text-green-500' },
  { title: 'Total Cars', value: 127, icon: Car, color: 'text-blue-500' },
  { title: 'Active Users', value: 1834, icon: Users, color: 'text-purple-500' },
  { title: 'Bookings', value: 892, icon: BookOpen, color: 'text-orange-500' },
];

const recentBookings = [
  { id: 1, car: 'Tesla Model 3', user: 'John Doe', date: '2025-10-22', status: 'Active' },
  { id: 2, car: 'BMW X5', user: 'Jane Smith', date: '2025-10-23', status: 'Pending' },
  { id: 3, car: 'Porsche 911', user: 'Mike Johnson', date: '2025-10-24', status: 'Active' },
  { id: 4, car: 'Mercedes C-Class', user: 'Sarah Wilson', date: '2025-10-25', status: 'Completed' },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card hover-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <AnimatedCounter end={stat.value} prefix={stat.prefix} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest rental activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                  >
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
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'Active'
                            ? 'bg-green-500/20 text-green-500'
                            : booking.status === 'Pending'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-blue-500/20 text-blue-500'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Revenue Growth</span>
                  </div>
                  <span className="text-sm font-bold text-green-500">+23.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">Booking Rate</span>
                  </div>
                  <span className="text-sm font-bold text-blue-500">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="text-sm">New Users</span>
                  </div>
                  <span className="text-sm font-bold text-purple-500">+145</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">Fleet Utilization</span>
                  </div>
                  <span className="text-sm font-bold text-orange-500">85%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
