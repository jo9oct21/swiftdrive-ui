import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreHorizontal, Ban, Shield } from 'lucide-react';
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

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  bookings: number;
}

const initialUsers: UserItem[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', bookings: 5 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', bookings: 12 },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive', bookings: 3 },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'User', status: 'Active', bookings: 8 },
];

// Shared state for cross-page admin/user management
let sharedAdminList: UserItem[] = [];
export const getPromotedAdmins = () => sharedAdminList;
export const addDemotedUser = (user: UserItem) => { /* handled via state */ };

const SuperAdminUsers = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState<UserItem[]>(initialUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'suspend' | 'makeAdmin'>('suspend');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const filteredUsers = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (userId: number, action: 'suspend' | 'makeAdmin') => {
    setSelectedUserId(userId);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedUserId) return;

    if (dialogAction === 'suspend') {
      const user = userList.find(u => u.id === selectedUserId);
      const newStatus = user?.status === 'Suspended' ? 'Active' : 'Suspended';
      setUserList(prev => prev.map(u =>
        u.id === selectedUserId ? { ...u, status: newStatus } : u
      ));
      toast({ title: 'Success', description: `User ${newStatus === 'Suspended' ? 'suspended' : 'unsuspended'} successfully` });
    } else {
      // Remove from users list (promoted to admin)
      const user = userList.find(u => u.id === selectedUserId);
      if (user) {
        setUserList(prev => prev.filter(u => u.id !== selectedUserId));
        toast({ title: 'Success', description: `${user.name} promoted to Admin and moved to Admins page` });
      }
    }

    setDialogOpen(false);
    setSelectedUserId(null);
  };

  const selectedUser = userList.find(u => u.id === selectedUserId);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold text-gradient mb-2">Manage Users</h1>
        <p className="text-muted-foreground text-sm sm:text-base">View and manage all user accounts</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search users..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div>
                    <p>{user.name}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                <TableCell>{user.bookings}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'Active' ? 'bg-green-500/20 text-green-500'
                    : user.status === 'Suspended' ? 'bg-red-500/20 text-red-500'
                    : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAction(user.id, 'suspend')}>
                        <Ban className="w-4 h-4 mr-2" />
                        {user.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction(user.id, 'makeAdmin')}>
                        <Shield className="w-4 h-4 mr-2" /> Make Admin
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
                ? (selectedUser?.status === 'Suspended' ? 'Unsuspend User?' : 'Suspend User?')
                : 'Promote to Admin?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === 'suspend'
                ? (selectedUser?.status === 'Suspended'
                    ? 'This will restore the user\'s access.'
                    : 'This will temporarily block the user from accessing their account.')
                : `This will promote ${selectedUser?.name} to Admin and remove them from the Users list.`}
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

export default SuperAdminUsers;
