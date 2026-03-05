import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreHorizontal, Ban, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
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

interface AdminItem {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const initialAdmins: AdminItem[] = [
  { id: 1, name: 'Admin User', email: 'admin@luxedrive.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Admin', email: 'jane.admin@luxedrive.com', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Tom Manager', email: 'tom@luxedrive.com', role: 'Admin', status: 'Active' },
];

const SuperAdminAdmins = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [adminList, setAdminList] = useState(initialAdmins);
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
      const admin = adminList.find(a => a.id === selectedAdminId);
      const newStatus = admin?.status === 'Suspended' ? 'Active' : 'Suspended';
      setAdminList(prev => prev.map(a =>
        a.id === selectedAdminId ? { ...a, status: newStatus } : a
      ));
      toast({ title: 'Success', description: `Admin ${newStatus === 'Suspended' ? 'suspended' : 'unsuspended'} successfully` });
    } else {
      // Remove from admins list (demoted to user)
      const admin = adminList.find(a => a.id === selectedAdminId);
      if (admin) {
        setAdminList(prev => prev.filter(a => a.id !== selectedAdminId));
        toast({ title: 'Success', description: `${admin.name} returned to User role and moved to Users page` });
      }
    }

    setDialogOpen(false);
    setSelectedAdminId(null);
  };

  const selectedAdmin = adminList.find(a => a.id === selectedAdminId);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold text-gradient mb-2">Manage Admins</h1>
        <p className="text-muted-foreground text-sm sm:text-base">View and manage administrator accounts</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search admins..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">
                  <div>
                    <p>{admin.name}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{admin.email}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{admin.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="hidden sm:inline">{admin.role}</span>
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
                        <User className="w-4 h-4 mr-2" /> Return to User
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
                : 'Return to User?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === 'suspend'
                ? (selectedAdmin?.status === 'Suspended'
                    ? 'This will restore the admin\'s access.'
                    : 'This will temporarily block the admin from accessing their account.')
                : `This will remove ${selectedAdmin?.name}'s admin privileges and move them to the Users page.`}
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
