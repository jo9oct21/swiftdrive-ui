import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Car } from '@/types/Car';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from './ImageUpload';
import { useEffect } from 'react';

interface CarDialogProps {
  car?: Car;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (car: Car) => void;
}

export const CarDialog = ({ car, open, onOpenChange, onSave }: CarDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Car>>({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Sedan',
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 5,
    pricePerDay: 0,
    rating: 5,
    reviews: 0,
    image: '',
    features: [],
    description: '',
    mileage: '',
    available: true,
  });

  useEffect(() => {
    if (car) {
      setFormData(car);
    } else {
      setFormData({
        name: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        type: 'Sedan',
        transmission: 'Automatic',
        fuel: 'Petrol',
        seats: 5,
        pricePerDay: 0,
        rating: 5,
        reviews: 0,
        image: '',
        features: [],
        description: '',
        mileage: '',
        available: true,
      });
    }
  }, [car, open]);

  const handleSubmit = () => {
    if (!formData.name || !formData.brand || !formData.pricePerDay) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    onSave({
      ...formData,
      id: car?.id || `car-${Date.now()}`,
    } as Car);

    toast({ title: 'Success', description: `Car ${car ? 'updated' : 'added'} successfully` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{car ? 'Edit Car' : 'Add New Car'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Brand *</Label>
            <Input
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Input
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Year</Label>
            <Input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as Car['type'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Luxury">Luxury</SelectItem>
                <SelectItem value="Compact">Compact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Transmission</Label>
            <Select
              value={formData.transmission}
              onValueChange={(value) => setFormData({ ...formData, transmission: value as Car['transmission'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fuel Type</Label>
            <Select
              value={formData.fuel}
              onValueChange={(value) => setFormData({ ...formData, fuel: value as Car['fuel'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Seats</Label>
            <Input
              type="number"
              value={formData.seats}
              onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Price per Day *</Label>
            <Input
              type="number"
              value={formData.pricePerDay}
              onChange={(e) => setFormData({ ...formData, pricePerDay: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Mileage</Label>
            <Input
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
              placeholder="e.g., 15 km/l"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <ImageUpload
              value={formData.image}
              onChange={(base64) => setFormData({ ...formData, image: base64 })}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="gradient">
            {car ? 'Update' : 'Add'} Car
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
