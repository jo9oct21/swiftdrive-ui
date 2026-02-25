import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'penalty';
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  favoritesEnabled: boolean;
  setFavoritesEnabled: (enabled: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Welcome to DriveNow!', message: 'Thank you for joining. Explore our premium fleet and book your dream car today.', type: 'info', read: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', title: 'Booking Reminder', message: 'Your Tesla Model 3 booking starts tomorrow. Please arrive 15 minutes early for pickup.', type: 'warning', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', title: 'Special Offer', message: 'Get 20% off on weekend rentals! Use code WEEKEND20 at checkout.', type: 'success', read: false, createdAt: new Date().toISOString() },
  { id: '4', title: 'Late Return Penalty', message: 'A penalty of $50 has been applied to booking #3 for late return.', type: 'penalty', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem('notifications_enabled');
    return stored ? JSON.parse(stored) : true;
  });

  const [favoritesEnabled, setFavoritesEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem('favorites_enabled');
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('notifications_enabled', JSON.stringify(notificationsEnabled)); }, [notificationsEnabled]);
  useEffect(() => { localStorage.setItem('favorites_enabled', JSON.stringify(favoritesEnabled)); }, [favoritesEnabled]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    setNotifications(prev => [{ ...notification, id: Date.now().toString(), read: false, createdAt: new Date().toISOString() }, ...prev]);
  };

  const markAsRead = (id: string) => { setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); };
  const markAllAsRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); };
  const clearAll = () => { setNotifications([]); };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, notificationsEnabled, setNotificationsEnabled, favoritesEnabled, setFavoritesEnabled, addNotification, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
