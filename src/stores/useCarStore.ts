import { create } from 'zustand';
import { Car } from '@/types/Car';
import { cars as initialCars } from '@/data/cars';

interface CarStore {
  cars: Car[];
  addCar: (car: Car) => void;
  updateCar: (id: string, updates: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  getCarById: (id: string) => Car | undefined;
}

export const useCarStore = create<CarStore>((set, get) => ({
  cars: initialCars,

  addCar: (car) => set(state => ({ cars: [...state.cars, car] })),

  updateCar: (id, updates) => set(state => ({
    cars: state.cars.map(c => c.id === id ? { ...c, ...updates } : c)
  })),

  deleteCar: (id) => set(state => ({
    cars: state.cars.filter(c => c.id !== id)
  })),

  getCarById: (id) => get().cars.find(c => c.id === id),
}));
