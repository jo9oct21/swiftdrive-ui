import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreHorizontal, Ban, Shield, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const demoAdmins = [
  { id: 1, name: 'Admin User', email: 'admin@luxedrive.com', role: 'Admin', status: 'Active', bookings: 0 },
  { id: 2, name: 'Jane Admin', email: 'jane.admin@luxedrive.com', role: 'Admin', status: 'Active', bookings: 0 },
  { id: 3, name: 'Tom Manager', email: 'tom@luxedrive.com', role: 'Admin', status: 'Active', bookings: 0 },
];

const SuperAdminAdmins = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [adminList, setAdminList] = useState(demoAdmins);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'suspend' | 'demote'>('suspend');
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);

  const filteredAdmins = adminList.filter(
    (admin) =>
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (adminId: number, action: 'suspend' | 'demote') => {
    setSelectedAdminId(adminId);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedAdminId) return;

    if (dialogAction === 'suspend') {
      setAdminList(prev => prev.map(a =>
        a.id === selectedAdminId
          ? { ...a, status: a.status === 'Suspended' ? 'Active' : 'Suspended' }
          : a
      ));
      const admin = adminList.find(a => a.id === selectedAdminId);
      toast({ title: 'Success', description: `Admin ${admin?.status === 'Suspended' ? 'unsuspended' : 'suspended'} successfully` });
    } else {
      setAdminList(prev => prev.map(a =>
        a.id === selectedAdminId ? { ...a, role: 'User' } : a
      ));
      toast({ title: 'Success', description: 'Admin demoted to User' });
    }

    setDialogOpen(false);
    setSelectedAdminId(null);
  };

  const selectedAdmin = adminList.find(a => a.id === selectedAdminId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Manage Admins</h1>
        <p className="text-muted-foreground">View and manage administrator accounts</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search admins..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>{admin.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    admin.status === 'Active' ? 'bg-green-500/20 text-green-500'
                    : admin.status === 'Suspended' ? 'bg-red-500/20 text-red-500'
                    : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {admin.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAction(admin.id, 'suspend')}>
                        <Ban className="w-4 h-4 mr-2" />
                        {admin.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction(admin.id, 'demote')}>
                        <User className="w-4 h-4 mr-2" /> Make User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogAction === 'suspend'
                ? (selectedAdmin?.status === 'Suspended' ? 'Unsuspend Admin?' : 'Suspend Admin?')
                : 'Demote to User?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === 'suspend'
                ? (selectedAdmin?.status === 'Suspended'
                    ? 'This will restore the admin\'s access.'
                    : 'This will temporarily block the admin from accessing their account.')
                : 'This will remove admin privileges and demote to regular user.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SuperAdminAdmins;
