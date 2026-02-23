import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const historyData: Record<string, { id: number; car: string; date: string; total: number; status: string }[]> = {
  'February 2026': [
    { id: 1, car: 'Tesla Model 3', date: '2026-02-15', total: 267, status: 'Completed' },
    { id: 2, car: 'BMW X5', date: '2026-02-10', total: 500, status: 'Completed' },
  ],
  'January 2026': [
    { id: 3, car: 'Porsche 911', date: '2026-01-20', total: 598, status: 'Completed' },
    { id: 4, car: 'Mercedes C-Class', date: '2026-01-05', total: 380, status: 'Completed' },
  ],
  'December 2025': [
    { id: 5, car: 'Audi Q7', date: '2025-12-18', total: 460, status: 'Completed' },
    { id: 6, car: 'Toyota Camry', date: '2025-12-02', total: 195, status: 'Completed' },
  ],
};

const History = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Booking History</h1>
          </div>

          <div className="space-y-8">
            {Object.entries(historyData).map(([month, bookings], mi) => (
              <motion.div key={month} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: mi * 0.1 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">{month}</h2>
                  <span className="text-sm text-muted-foreground">({bookings.length} bookings)</span>
                </div>
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{booking.car}</p>
                          <p className="text-sm text-muted-foreground">{booking.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${booking.total}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                            {booking.status}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default History;
