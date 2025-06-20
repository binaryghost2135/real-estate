
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from 'lucide-react';
import type { Property } from '@/types';

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: Property) => void;
  property: Property | null;
}

// Define a specific type for the form state in EditPropertyModal
type EditPropertyFormState = Omit<Property, 'id' | 'imageUrls'> & {
  imageUrlsText: string;
};

const EditPropertyModal: FC<EditPropertyModalProps> = ({ isOpen, onClose, onSubmit, property }) => {
  // Initialize form state with a defined structure
  const [formState, setFormState] = useState<EditPropertyFormState>({
    name: '',
    type: 'buy',
    address: '',
    price: '',
    bedrooms: 0,
    bathrooms: 0,
    area: '',
    description: '',
    imageUrlsText: '',
    dataAiHint: '',
  });

  useEffect(() => {
    if (property && isOpen) {
      setFormState({
        name: property.name,
        type: property.type,
        address: property.address,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        description: property.description,
        imageUrlsText: property.imageUrls.join(', '), // Convert array to comma-separated string
        dataAiHint: property.dataAiHint || '',
      });
    }
  }, [property, isOpen]);

  if (!property) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: (name === 'bedrooms' || name === 'bathrooms') ? (value === '' ? 0 : parseInt(value, 10)) : value
    }));
  };

  const handleTypeChange = (value: 'buy' | 'rent') => {
    setFormState(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    const updatedProperty: Property = {
      id: property.id, // Retain the original ID
      name: formState.name,
      type: formState.type,
      address: formState.address,
      price: formState.price,
      bedrooms: Number(formState.bedrooms),
      bathrooms: Number(formState.bathrooms),
      area: formState.area,
      description: formState.description,
      imageUrls: formState.imageUrlsText.split(',').map(url => url.trim()).filter(url => url), // Convert string back to array
      dataAiHint: formState.dataAiHint,
    };

    if (updatedProperty.bedrooms < 0 || updatedProperty.bathrooms < 0) {
        alert("Bedrooms and bathrooms cannot be negative.");
        return;
    }
    onSubmit(updatedProperty);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-card-foreground">Edit Property</DialogTitle>
          <DialogDescription>
            Update the details for &quot;{property.name}&quot;.
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
              <Label htmlFor="edit-name" className="text-right col-span-1">Name</Label>
              <Input id="edit-name" name="name" value={formState.name} onChange={handleChange} required className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right col-span-1">Type</Label>
              <RadioGroup value={formState.type} onValueChange={handleTypeChange} className="col-span-3 flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="edit-type-buy" />
                  <Label htmlFor="edit-type-buy">Buy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rent" id="edit-type-rent" />
                  <Label htmlFor="edit-type-rent">Rent</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right col-span-1">Address</Label>
              <Input id="edit-address" name="address" value={formState.address} onChange={handleChange} required className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right col-span-1">Price</Label>
              <Input id="edit-price" name="price" value={formState.price} onChange={handleChange} required className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-bedrooms" className="text-right col-span-1">Bedrooms</Label>
              <Input id="edit-bedrooms" name="bedrooms" type="number" min="0" value={formState.bedrooms} onChange={handleChange} required className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-bathrooms" className="text-right col-span-1">Bathrooms</Label>
              <Input id="edit-bathrooms" name="bathrooms" type="number" min="0" value={formState.bathrooms} onChange={handleChange} required className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-area" className="text-right col-span-1">Area</Label>
              <Input id="edit-area" name="area" value={formState.area} onChange={handleChange} required className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-description" className="text-right col-span-1 mt-2">Description</Label>
              <Textarea id="edit-description" name="description" value={formState.description} onChange={handleChange} required className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-imageUrlsText" className="text-right col-span-1 mt-2">Image URLs</Label>
              <Textarea id="edit-imageUrlsText" name="imageUrlsText" value={formState.imageUrlsText} onChange={handleChange} className="col-span-3" placeholder="Comma-separated URLs"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-dataAiHint" className="text-right col-span-1">Image Hint</Label>
              <Input id="edit-dataAiHint" name="dataAiHint" value={formState.dataAiHint} onChange={handleChange} className="col-span-3" placeholder="e.g., modern apartment (max 2 words)"/>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyModal;
