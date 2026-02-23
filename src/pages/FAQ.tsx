import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'How do I book a car?', a: 'Browse our fleet, select a car, choose your dates and locations, then confirm your booking. You can pay via Chapa at checkout.' },
  { q: 'What documents do I need?', a: 'You need a valid driver\'s license, a government-issued ID, and a credit card for the security deposit.' },
  { q: 'Can I cancel my booking?', a: 'Yes, you can cancel up to 24 hours before pickup for a full refund. Late cancellations may incur a fee.' },
  { q: 'What is the minimum rental period?', a: 'The minimum rental period is 1 day (24 hours).' },
  { q: 'Is insurance included?', a: 'Basic insurance is included in all rentals. You can upgrade to premium coverage at checkout.' },
  { q: 'What happens if I return the car late?', a: 'Late returns incur a penalty fee. Please check our penalty policy in the booking terms.' },
  { q: 'Do you offer airport pickup?', a: 'Yes, we offer pickup and drop-off at major airports. Select the airport location during booking.' },
  { q: 'How do I contact support?', a: 'You can reach us via phone, email, or through the Contact page on our website.' },
];

const FAQ = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h1>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
