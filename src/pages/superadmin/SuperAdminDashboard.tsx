import { motion } from 'framer-motion';
import { Users, Shield, TrendingUp, BookOpen, Crown } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { title: 'Total Users', value: 1834, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { title: 'Total Admins', value: 5, icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { title: 'Suspended Users', value: 12, icon: Users, color: 'text-red-500', bg: 'bg-red-500/10' },
  { title: 'Active Bookings', value: 892, icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10' },
];

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Full system overview and management</p>
      </div>

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
                  <AnimatedCounter end={stat.value} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
