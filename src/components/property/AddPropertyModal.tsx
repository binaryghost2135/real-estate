
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
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from 'lucide-react';
import type { Property } from '@/types';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: Omit<Property, 'id' | 'imageUrls'> & { imageUrlsText: string }) => void;
}

const initialFormState = {
  name: '',
  type: 'buy' as 'buy' | 'rent',
  address: '',
  price: '',
  bedrooms: 1,
  bathrooms: 1,
  area: '',
  description: '',
  imageUrlsText: '', // To handle comma-separated URLs
  dataAiHint: '',
};

const AddPropertyModal: FC<AddPropertyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: name === 'bedrooms' || name === 'bathrooms' ? parseInt(value, 10) : value }));
  };

  const handleTypeChange = (value: 'buy' | 'rent') => {
    setFormState(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.bedrooms < 0 || formState.bathrooms < 0) {
        alert("Bedrooms and bathrooms cannot be negative."); // Simple validation
        return;
    }
    onSubmit(formState);
    setFormState(initialFormState); // Reset form
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-card-foreground">Add New Property</DialogTitle>
           <DialogDescription>
            Fill in the details for the new property listing.
          </DialogDescription>
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
              <Label htmlFor="name" className="text-right col-span-1">Name</Label>
              <Input id="name" name="name" value={formState.name} onChange={handleChange} required className="col-span-3" placeholder="e.g., Modern Apartment" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right col-span-1">Type</Label>
              <RadioGroup value={formState.type} onValueChange={handleTypeChange} className="col-span-3 flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="type-buy" />
                  <Label htmlFor="type-buy">Buy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rent" id="type-rent" />
                  <Label htmlFor="type-rent">Rent</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right col-span-1">Address</Label>
              <Input id="address" name="address" value={formState.address} onChange={handleChange} required className="col-span-3" placeholder="Full Address" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right col-span-1">Price</Label>
              <Input id="price" name="price" value={formState.price} onChange={handleChange} required className="col-span-3" placeholder="e.g., ₹2.5 Cr or ₹45,000/month" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bedrooms" className="text-right col-span-1">Bedrooms</Label>
              <Input id="bedrooms" name="bedrooms" type="number" min="0" value={formState.bedrooms} onChange={handleChange} required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bathrooms" className="text-right col-span-1">Bathrooms</Label>
              <Input id="bathrooms" name="bathrooms" type="number" min="0" value={formState.bathrooms} onChange={handleChange} required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area" className="text-right col-span-1">Area</Label>
              <Input id="area" name="area" value={formState.area} onChange={handleChange} required className="col-span-3" placeholder="e.g., 1200 sqft" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right col-span-1 mt-2">Description</Label>
              <Textarea id="description" name="description" value={formState.description} onChange={handleChange} required className="col-span-3" placeholder="Property description..." />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="imageUrlsText" className="text-right col-span-1 mt-2">Image URLs</Label>
              <Textarea id="imageUrlsText" name="imageUrlsText" value={formState.imageUrlsText} onChange={handleChange} className="col-span-3" placeholder="Comma-separated URLs" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataAiHint" className="text-right col-span-1">Image Hint</Label>
              <Input id="dataAiHint" name="dataAiHint" value={formState.dataAiHint} onChange={handleChange} className="col-span-3" placeholder="e.g., modern apartment (max 2 words)" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Property</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyModal;
