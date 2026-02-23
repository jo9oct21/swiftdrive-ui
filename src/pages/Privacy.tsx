import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          </div>
          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section><h2 className="text-xl font-semibold mb-3">Information We Collect</h2><p className="text-muted-foreground">We collect personal information including name, email, phone number, and payment details necessary to process your bookings.</p></section>
            <section><h2 className="text-xl font-semibold mb-3">How We Use Your Data</h2><p className="text-muted-foreground">Your data is used to process bookings, communicate updates, improve our services, and comply with legal obligations.</p></section>
            <section><h2 className="text-xl font-semibold mb-3">Data Security</h2><p className="text-muted-foreground">We implement industry-standard security measures to protect your personal information from unauthorized access.</p></section>
            <section><h2 className="text-xl font-semibold mb-3">Cookies</h2><p className="text-muted-foreground">We use cookies to enhance your experience. You can manage cookie preferences in your browser settings.</p></section>
            <section><h2 className="text-xl font-semibold mb-3">Your Rights</h2><p className="text-muted-foreground">You have the right to access, correct, or delete your personal data. Contact us to exercise these rights.</p></section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
