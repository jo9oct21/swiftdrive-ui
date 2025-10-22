import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  bookings: number;
}

interface UserDialogProps {
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: User) => void;
}

export const UserDialog = ({ user, open, onOpenChange, onSave }: UserDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      name: '',
      email: '',
      role: 'User',
      status: 'Active',
      bookings: 0,
    }
  );

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    onSave({
      ...formData,
      id: user?.id || Date.now(),
    } as User);

    toast({ title: 'Success', description: `User ${user ? 'updated' : 'added'} successfully` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="gradient">
            {user ? 'Update' : 'Add'} User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
