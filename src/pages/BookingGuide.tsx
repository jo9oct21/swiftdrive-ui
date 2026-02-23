import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Search, Car, CreditCard, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  { icon: Search, title: 'Browse & Search', description: 'Explore our premium fleet. Use filters to find the perfect car by type, price, fuel, and transmission.' },
  { icon: Car, title: 'Select Your Car', description: 'View detailed specifications, photos, and reviews. Check availability and pricing for your dates.' },
  { icon: CreditCard, title: 'Book & Pay', description: 'Choose your pickup and return dates/locations. Complete payment securely via Chapa payment system.' },
  { icon: Key, title: 'Pick Up & Drive', description: 'Arrive at the pickup location with your ID and license. Inspect the vehicle and hit the road!' },
];

const BookingGuide = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Booking Guide</h1>
          </div>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                <Card className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-start gap-5">
                    <div className="bg-primary/10 p-4 rounded-xl flex-shrink-0">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold bg-primary text-primary-foreground px-2.5 py-1 rounded-full">Step {i + 1}</span>
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingGuide;
