
"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { X } from 'lucide-react'; // No longer needed

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email?: string, password?: string) => void;
}

const LoginModal: FC<LoginModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-card-foreground">Admin Login</DialogTitle>
          <DialogDescription>
            Enter your admin credentials to access management features.
          </DialogDescription>
          {/* The explicit DialogClose button was here and has been removed */}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right col-span-1">
                Email
              </Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="col-span-3" 
                placeholder="Email Address" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right col-span-1">
                Password
              </Label>
              <Input 
                id="password" 
                name="password" 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="col-span-3" 
                placeholder="••••••••" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Login</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
