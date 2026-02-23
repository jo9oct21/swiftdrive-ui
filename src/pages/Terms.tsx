import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
          </div>
          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section><h2 className="text-xl font-semibold mb-3">1. Rental Agreement</h2><p className="text-muted-foreground">By renting a vehicle from DriveNow, you agree to these terms and conditions. The rental period begins at pickup and ends upon return of the vehicle.</p></section>
            <section><h2 className="text-xl font-semibold mb-3">2. Eligibility</h2><p className="text-muted-foreground">Renters must be at least 21 years old with a valid driver's license held for a minimum of 2 years. Additional drivers must also meet these requirements.</p></section>
            <section><h2 className="text-xl font-semibold mb-3">3. Payment</h2><p className="text-muted-foreground">Full payment is required at the time of booking. We accept payments via Chapa payment system. A security deposit may be required.</p></section>
            <section><h2 className="text-xl font-semibold mb-3">4. Vehicle Condition</h2><p className="text-muted-foreground">Vehicles must be returned in the same condition as received. Any damage will be assessed and charged accordingly.</p></section>
            <section><h2 className="text-xl font-semibold mb-3">5. Late Returns</h2><p className="text-muted-foreground">Late returns will incur a penalty fee of $50 per day. Repeated late returns may result in account suspension.</p></section>
            <section><h2 className="text-xl font-semibold mb-3">6. Cancellation Policy</h2><p className="text-muted-foreground">Free cancellation up to 24 hours before pickup. Cancellations within 24 hours will incur a 50% charge.</p></section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
