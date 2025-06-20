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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface SellPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: SellPropertyDetails) => void;
}

export interface SellPropertyDetails {
  propertyType: string;
  location: string;
  price: string;
  contact: string;
}

const SellPropertyModal: FC<SellPropertyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [details, setDetails] = useState<SellPropertyDetails>({
    propertyType: '',
    location: '',
    price: '',
    contact: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
    setDetails({ propertyType: '', location: '', price: '', contact: '' }); // Reset form
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-card-foreground">List Your Property for Sale</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="propertyType" className="text-right col-span-1">
                Property Type
              </Label>
              <Input id="propertyType" name="propertyType" value={details.propertyType} onChange={handleChange} required className="col-span-3" placeholder="e.g., 2BHK, Penthouse" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right col-span-1">
                Location
              </Label>
              <Input id="location" name="location" value={details.location} onChange={handleChange} required className="col-span-3" placeholder="Full Address" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right col-span-1">
                Expected Price
              </Label>
              <Input id="price" name="price" value={details.price} onChange={handleChange} required className="col-span-3" placeholder="e.g., ₹2.5 Cr or ₹45,000/month" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right col-span-1">
                Contact No.
              </Label>
              <Input id="contact" name="contact" type="tel" value={details.contact} onChange={handleChange} required className="col-span-3" placeholder="Your Phone Number" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">Send via WhatsApp</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SellPropertyModal;
