import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Lock, Eye, EyeOff, Shield, Smartphone, Clock, Bell, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings = () => {
  const { user, isAuthenticated, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '', email: user?.email || '', phone: '', address: '', bio: '', dateOfBirth: '',
  });

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const { notificationsEnabled, setNotificationsEnabled, favoritesEnabled, setFavoritesEnabled } = useNotifications();
  const [securitySettings, setSecuritySettings] = useState({ twoFactorEnabled: false, emailNotifications: true, loginAlerts: true });

  useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully.' });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Password Changed', description: 'Your password has been updated successfully.' });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    toast({ title: 'Account Deleted', description: 'Your account has been permanently deleted.', variant: 'destructive' });
    navigate('/');
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Account <span className="luxury-text-gradient">Settings</span>
            </h1>
            <p className="text-muted-foreground">Manage your profile, security, and preferences</p>
          </div>

          <Card className="glass-card">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-gold/50">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-gold text-foreground text-2xl font-bold">
                      {getInitials(user?.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0 bg-gold hover:bg-gold/90">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2"><User className="h-4 w-4 text-primary" />Full Name</Label>
                        <Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} placeholder="Enter your name" className="glass-card" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />Email Address</Label>
                        <Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} placeholder="Enter your email" className="glass-card" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />Phone Number</Label>
                        <Input id="phone" type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} placeholder="Enter your phone" className="glass-card" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Date of Birth</Label>
                        <Input id="dob" type="date" value={profileData.dateOfBirth} onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })} className="glass-card" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Address</Label>
                      <Input id="address" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} placeholder="Enter your address" className="glass-card" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} placeholder="Tell us about yourself" className="glass-card resize-none" rows={4} />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="flex-1 bg-gradient-gold hover:shadow-glow text-foreground font-semibold">Save Changes</Button>
                      <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                    </div>

                    {/* Delete Account */}
                    <div className="pt-6 border-t border-border">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="glass-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Account</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove all your data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </form>
                </TabsContent>

                {/* Password Tab */}
                <TabsContent value="password">
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    {[
                      { id: 'current', label: 'Current Password', key: 'currentPassword' as const, show: showPasswords.current, toggleKey: 'current' as const },
                      { id: 'new', label: 'New Password', key: 'newPassword' as const, show: showPasswords.new, toggleKey: 'new' as const },
                      { id: 'confirm', label: 'Confirm New Password', key: 'confirmPassword' as const, show: showPasswords.confirm, toggleKey: 'confirm' as const },
                    ].map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id} className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary" />{field.label}</Label>
                        <div className="relative">
                          <Input id={field.id} type={field.show ? 'text' : 'password'} value={passwordData[field.key]}
                            onChange={(e) => setPasswordData({ ...passwordData, [field.key]: e.target.value })}
                            placeholder={field.label} className="glass-card pr-10" required />
                          <button type="button" onClick={() => setShowPasswords({ ...showPasswords, [field.toggleKey]: !field.show })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="flex-1 bg-gradient-gold hover:shadow-glow text-foreground font-semibold">Update Password</Button>
                      <Button type="button" variant="outline" onClick={() => setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })}>Clear</Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { icon: Smartphone, title: 'Two-Factor Authentication', desc: 'Add an extra layer of security', checked: securitySettings.twoFactorEnabled, onChange: (v: boolean) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: v }) },
                        { icon: Mail, title: 'Email Notifications', desc: 'Receive updates about your account', checked: securitySettings.emailNotifications, onChange: (v: boolean) => setSecuritySettings({ ...securitySettings, emailNotifications: v }) },
                        { icon: Bell, title: 'Notification Icon', desc: 'Show notification bell in navbar', checked: notificationsEnabled, onChange: setNotificationsEnabled },
                        { icon: Heart, title: 'Favorites Icon', desc: 'Show favorites heart icon in navbar', checked: favoritesEnabled, onChange: setFavoritesEnabled },
                        { icon: Shield, title: 'Login Alerts', desc: 'Get notified of new login attempts', checked: securitySettings.loginAlerts, onChange: (v: boolean) => setSecuritySettings({ ...securitySettings, loginAlerts: v }) },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 glass-card rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10"><item.icon className="h-5 w-5 text-primary" /></div>
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                          </div>
                          <Switch checked={item.checked} onCheckedChange={item.onChange} />
                        </div>
                      ))}
                    </div>

                    <div className="p-4 glass-card rounded-lg border-l-4 border-primary">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-1">Active Sessions</h3>
                          <p className="text-sm text-muted-foreground mb-3">You are currently logged in on these devices:</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-background/50 rounded-md">
                              <div>
                                <p className="text-sm font-medium">Current Device</p>
                                <p className="text-xs text-muted-foreground">Last active: Now</p>
                              </div>
                              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full">Active</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={() => toast({ title: 'Security Settings Saved', description: 'Your security preferences have been updated.' })}>
                      Save Security Settings
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
