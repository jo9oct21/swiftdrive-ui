import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cars } from '@/data/cars';
import { Car } from '@/types/Car';
import { CarDialog } from '@/components/admin/CarDialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ManageCars = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [carList, setCarList] = useState<Car[]>(cars);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);

  const filteredCars = carList.filter(
    (car) =>
      car.name.toLowerCase().includes(search.toLowerCase()) ||
      car.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCar = () => {
    setSelectedCar(undefined);
    setDialogOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setDialogOpen(true);
  };

  const handleSaveCar = (car: Car) => {
    if (selectedCar) {
      setCarList(carList.map((c) => (c.id === car.id ? car : c)));
    } else {
      setCarList([...carList, car]);
    }
  };

  const handleDeleteClick = (carId: string) => {
    setCarToDelete(carId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (carToDelete) {
      setCarList(carList.filter((c) => c.id !== carToDelete));
      toast({ title: 'Success', description: 'Car deleted successfully' });
    }
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Manage Cars</h1>
          <p className="text-muted-foreground">Add, edit, or remove cars from your fleet</p>
        </div>
        <Button variant="gradient" size="lg" onClick={handleAddCar}>
          <Plus className="w-5 h-5 mr-2" />
          Add New Car
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search cars..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-lg overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-16 h-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{car.name}</TableCell>
                <TableCell>{car.brand}</TableCell>
                <TableCell>{car.type}</TableCell>
                <TableCell>${car.pricePerDay}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                    Available
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditCar(car)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(car.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <CarDialog
        car={selectedCar}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveCar}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the car from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageCars;
