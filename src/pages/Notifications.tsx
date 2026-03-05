import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, AlertTriangle, Info, CircleCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { format } from 'date-fns';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'info': return <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />;
    case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />;
    case 'success': return <CircleCheck className="h-5 w-5 text-green-500 flex-shrink-0" />;
    case 'penalty': return <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />;
  }
};

const getNotificationBg = (type: Notification['type'], read: boolean) => {
  if (read) return 'bg-muted/30';
  switch (type) {
    case 'info': return 'bg-blue-500/5 border-blue-500/20';
    case 'warning': return 'bg-yellow-500/5 border-yellow-500/20';
    case 'success': return 'bg-green-500/5 border-green-500/20';
    case 'penalty': return 'bg-red-500/5 border-red-500/20';
  }
};

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotifications();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl overflow-x-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Notifications</h1>
                <p className="text-muted-foreground text-sm">{unreadCount} unread</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Mark all</span> read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <Trash2 className="h-4 w-4 mr-1 sm:mr-2" /> Clear<span className="hidden sm:inline"> all</span>
                </Button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-20">
              <Bell className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-2">No notifications</h2>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div key={notification.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md border ${getNotificationBg(notification.type, notification.read)} ${!notification.read ? 'border-l-4' : ''}`}
                    onClick={() => markAsRead(notification.id)}>
                    <CardContent className="p-3 sm:p-4 flex items-start gap-3 sm:gap-4">
                      <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold text-sm truncate ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-muted-foreground break-words">{notification.message}</p>
                        <p className="text-xs text-muted-foreground/70 mt-2">
                          {format(new Date(notification.createdAt), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                      {!notification.read && (
                        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;
