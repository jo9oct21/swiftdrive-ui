import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  deleteAccount: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS = {
  admin: { id: '1', email: 'admin@luxedrive.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
  user: { id: '2', email: 'user@luxedrive.com', password: 'user123', name: 'John Doe', role: 'user' as const },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (email: string, password: string): boolean => {
    const demoUser = Object.values(DEMO_USERS).find(u => u.email === email && u.password === password);
    if (demoUser) {
      const { password: _, ...userWithoutPassword } = demoUser;
      setUser(userWithoutPassword);
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => { setUser(null); localStorage.removeItem('auth_user'); };

  const deleteAccount = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('favorites');
    localStorage.removeItem('notifications');
    localStorage.removeItem('notifications_enabled');
    localStorage.removeItem('favorites_enabled');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, deleteAccount, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
