import { create } from 'zustand';

export type BookingStatus = 'pending' | 'confirmed' | 'upcoming' | 'active' | 'completed' | 'cancelled' | 'failed' | 'overdue';

export interface BookingItem {
  id: number;
  car: string;
  carId: string;
  user: string;
  userEmail: string;
  pickupDate: string;
  returnDate: string;
  location: string;
  baseCost: number;
  penaltyAmount: number;
  penaltyPaid: boolean;
  penaltyType?: string;
  penaltySource?: 'admin' | 'system';
  status: BookingStatus;
  carTaken: boolean;
  carDelivered: boolean;
  carProblem: boolean;
  refundAmount: number;
  refundStatus: 'none' | 'processing' | 'refunded';
}

const initialBookings: BookingItem[] = [
  { id: 1, car: 'Tesla Model 3', carId: '1', user: 'John Doe', userEmail: 'user@luxedrive.com', pickupDate: '2026-03-10', returnDate: '2026-03-15', location: 'Addis Ababa - Bole', baseCost: 445, penaltyAmount: 0, penaltyPaid: false, status: 'upcoming', carTaken: false, carDelivered: false, carProblem: false, refundAmount: 0, refundStatus: 'none' },
  { id: 2, car: 'BMW X5', carId: '2', user: 'John Doe', userEmail: 'user@luxedrive.com', pickupDate: '2026-02-20', returnDate: '2026-03-10', location: 'Hawassa - Main Branch', baseCost: 625, penaltyAmount: 0, penaltyPaid: false, status: 'active', carTaken: true, carDelivered: true, carProblem: false, refundAmount: 0, refundStatus: 'none' },
  { id: 3, car: 'Porsche 911', carId: '3', user: 'Jane Smith', userEmail: 'jane@example.com', pickupDate: '2026-01-10', returnDate: '2026-01-13', location: 'Bahir Dar - City Center', baseCost: 897, penaltyAmount: 0, penaltyPaid: false, status: 'completed', carTaken: true, carDelivered: true, carProblem: false, refundAmount: 0, refundStatus: 'none' },
  { id: 4, car: 'Mercedes C-Class', carId: '4', user: 'John Doe', userEmail: 'user@luxedrive.com', pickupDate: '2026-02-01', returnDate: '2026-02-05', location: 'Dire Dawa - Airport', baseCost: 380, penaltyAmount: 38, penaltyPaid: false, status: 'cancelled', carTaken: false, carDelivered: false, carProblem: false, refundAmount: 342, refundStatus: 'refunded' },
  { id: 5, car: 'Audi Q7', carId: '5', user: 'Sarah Wilson', userEmail: 'sarah@example.com', pickupDate: '2026-02-15', returnDate: '2026-02-18', location: 'Adama - Downtown', baseCost: 345, penaltyAmount: 0, penaltyPaid: false, status: 'failed', carTaken: false, carDelivered: false, carProblem: true, refundAmount: 345, refundStatus: 'refunded' },
  { id: 6, car: 'Toyota Camry', carId: '6', user: 'Mike Johnson', userEmail: 'mike@example.com', pickupDate: '2026-10-23', returnDate: '2026-10-27', location: 'Addis Ababa - Bole', baseCost: 500, penaltyAmount: 0, penaltyPaid: false, status: 'pending', carTaken: false, carDelivered: false, carProblem: false, refundAmount: 0, refundStatus: 'none' },
  { id: 7, car: 'Audi Q7', carId: '5', user: 'Alex Brown', userEmail: 'alex@example.com', pickupDate: '2026-10-26', returnDate: '2026-10-30', location: 'Hawassa - Main Branch', baseCost: 460, penaltyAmount: 0, penaltyPaid: false, status: 'upcoming', carTaken: false, carDelivered: false, carProblem: false, refundAmount: 0, refundStatus: 'none' },
  { id: 8, car: 'Toyota Camry', carId: '6', user: 'Lisa Green', userEmail: 'lisa@example.com', pickupDate: '2026-02-15', returnDate: '2026-02-18', location: 'Bahir Dar - City Center', baseCost: 195, penaltyAmount: 50, penaltyPaid: false, penaltyType: 'late_return', penaltySource: 'system', status: 'overdue', carTaken: true, carDelivered: true, carProblem: false, refundAmount: 0, refundStatus: 'none' },
];

interface BookingStore {
  bookings: BookingItem[];
  
  // Mutations
  addBooking: (data: { car: string; carId: string; user: string; userEmail: string; pickupDate: string; returnDate: string; location: string; baseCost: number }) => void;
  updateBookingStatus: (id: number, status: BookingStatus) => void;
  cancelBooking: (id: number) => void;
  payPenalty: (id: number) => void;
  applyAdminPenalty: (id: number, penaltyType: string, amount: number) => void;
  applyOverduePenalty: (id: number) => void;
  allowBooking: (id: number) => void;
  rejectBooking: (id: number) => void;
  completeBooking: (id: number) => boolean;
  completeByOtherMethod: (id: number) => void;
  runStateMachine: () => void;
  
  // Selectors
  getBookingsForUser: (email: string) => BookingItem[];
  getAllBookings: () => BookingItem[];
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: initialBookings,

  addBooking: (data) => {
    set(state => {
      const maxId = state.bookings.reduce((max, b) => Math.max(max, b.id), 0);
      const newBooking: BookingItem = {
        id: maxId + 1,
        car: data.car,
        carId: data.carId,
        user: data.user,
        userEmail: data.userEmail,
        pickupDate: data.pickupDate,
        returnDate: data.returnDate,
        location: data.location,
        baseCost: data.baseCost,
        penaltyAmount: 0,
        penaltyPaid: false,
        status: 'upcoming',
        carTaken: false,
        carDelivered: false,
        carProblem: false,
        refundAmount: 0,
        refundStatus: 'none',
      };
      return { bookings: [...state.bookings, newBooking] };
    });
  },

  updateBookingStatus: (id, status) => {
    set(state => ({
      bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
    }));
  },

  cancelBooking: (id) => {
    set(state => ({
      bookings: state.bookings.map(b => {
        if (b.id !== id) return b;
        const penalty = Math.round(b.baseCost * 0.10);
        const refund = b.baseCost - penalty;
        return { ...b, status: 'cancelled' as BookingStatus, penaltyAmount: penalty, refundAmount: refund, refundStatus: 'refunded' as const };
      })
    }));
  },

  payPenalty: (id) => {
    set(state => ({
      bookings: state.bookings.map(b => {
        if (b.id !== id) return b;
        const isAdminPenalty = b.penaltySource === 'admin';
        return {
          ...b,
          penaltyPaid: true,
          ...(isAdminPenalty ? { status: 'completed' as BookingStatus } : {}),
        };
      })
    }));
  },

  applyAdminPenalty: (id, penaltyType, amount) => {
    set(state => ({
      bookings: state.bookings.map(b =>
        b.id === id ? { ...b, penaltyType, penaltyAmount: amount, penaltySource: 'admin' as const, penaltyPaid: false } : b
      )
    }));
  },

  applyOverduePenalty: (id) => {
    const booking = get().bookings.find(b => b.id === id);
    if (!booking) return;
    const now = new Date();
    const endDate = new Date(booking.returnDate);
    const daysLate = Math.max(1, Math.ceil((now.getTime() - endDate.getTime()) / 86400000));
    const totalPenalty = daysLate * 50;
    set(state => ({
      bookings: state.bookings.map(b =>
        b.id === id ? { ...b, penaltyAmount: totalPenalty, penaltyType: 'late_return', penaltySource: 'system' as const } : b
      )
    }));
  },

  allowBooking: (id) => {
    set(state => ({
      bookings: state.bookings.map(b =>
        b.id === id ? { ...b, status: 'active' as BookingStatus, carDelivered: true, carTaken: true } : b
      )
    }));
  },

  rejectBooking: (id) => {
    set(state => ({
      bookings: state.bookings.map(b => {
        if (b.id !== id) return b;
        return { ...b, status: 'failed' as BookingStatus, refundAmount: b.baseCost, refundStatus: 'refunded' as const };
      })
    }));
  },

  completeBooking: (id) => {
    const booking = get().bookings.find(b => b.id === id);
    if (!booking) return false;
    if (booking.status === 'overdue' && !booking.penaltyPaid) return false;
    set(state => ({
      bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'completed' as BookingStatus } : b)
    }));
    return true;
  },

  completeByOtherMethod: (id) => {
    set(state => ({
      bookings: state.bookings.map(b =>
        b.id === id ? { ...b, status: 'completed' as BookingStatus, penaltyPaid: true } : b
      )
    }));
  },

  runStateMachine: () => {
    const now = new Date();
    set(state => ({
      bookings: state.bookings.map(b => {
        const startDate = new Date(b.pickupDate);
        const endDate = new Date(b.returnDate);

        if (b.status === 'confirmed' && now < startDate) {
          return { ...b, status: 'upcoming' as BookingStatus };
        }
        if (b.status === 'upcoming' && now >= startDate && now <= endDate && b.carDelivered) {
          return { ...b, status: 'active' as BookingStatus, carTaken: true };
        }
        if (b.status === 'upcoming' && now >= startDate && b.carProblem) {
          return { ...b, status: 'failed' as BookingStatus, refundAmount: b.baseCost, refundStatus: 'processing' as const };
        }
        if (b.status === 'active' && now > endDate) {
          const daysLate = Math.ceil((now.getTime() - endDate.getTime()) / 86400000);
          return { ...b, status: 'overdue' as BookingStatus, penaltyAmount: daysLate * 50, penaltyType: 'late_return', penaltySource: 'system' as const };
        }
        if (b.status === 'overdue' && !b.penaltyPaid) {
          const daysLate = Math.ceil((now.getTime() - endDate.getTime()) / 86400000);
          const newPenalty = daysLate * 50;
          if (newPenalty !== b.penaltyAmount) return { ...b, penaltyAmount: newPenalty };
        }
        return b;
      })
    }));
  },

  getBookingsForUser: (email) => {
    return get().bookings.filter(b => b.userEmail === email);
  },

  getAllBookings: () => get().bookings,
}));
