
"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
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
type EditPropertyFormState = Omit<Property, 'id' | 'imageUrls'>;

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const EditPropertyModal: FC<EditPropertyModalProps> = ({ isOpen, onClose, onSubmit, property }) => {
  const [formState, setFormState] = useState<EditPropertyFormState>({
    name: '',
    type: 'buy',
    address: '',
    price: '',
    bedrooms: 0,
    bathrooms: 0,
    area: '',
    description: '',
    dataAiHint: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // For new file selections
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]); // To display current images

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
        dataAiHint: property.dataAiHint || '',
      });
      setExistingImageUrls(property.imageUrls);
      setImagePreviews([]); // Clear new previews when modal reopens with new property
      setSelectedFiles(null); // Clear selected files
    }
  }, [property, isOpen]);

  if (!property) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);
    if (files) {
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      // Clean up previous new previews
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews(newPreviews);
    } else {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    if (formState.bedrooms < 0 || formState.bathrooms < 0) {
        alert("Bedrooms and bathrooms cannot be negative.");
        return;
    }

    let finalImageUrls: string[] = property.imageUrls; // Default to existing
    if (selectedFiles && selectedFiles.length > 0) {
      try {
        finalImageUrls = await Promise.all(Array.from(selectedFiles).map(fileToDataUri));
      } catch (error) {
        console.error("Error converting files to Data URIs:", error);
        alert("Error processing new images. Please try again.");
        return;
      }
    }
    
    const updatedProperty: Property = {
      ...property, // Retain ID and other non-form fields from original property
      ...formState, // Apply changes from form state
      bedrooms: Number(formState.bedrooms), // Ensure numbers
      bathrooms: Number(formState.bathrooms),
      imageUrls: finalImageUrls, // Use newly processed or existing URLs
    };

    onSubmit(updatedProperty);
    // Clean up previews after successful submission
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setSelectedFiles(null);
  };

  const handleCloseModal = () => {
    onClose();
    // Clean up previews when modal is closed without submitting
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setExistingImageUrls([]);
    setSelectedFiles(null);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-card-foreground">Edit Property</DialogTitle>
          <DialogDescription>
            Update the details for &quot;{property.name}&quot;.
          </DialogDescription>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" onClick={handleCloseModal}>
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
            
            {existingImageUrls.length > 0 && (
                 <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right col-span-1 mt-2">Current Images</Label>
                    <div className="col-span-3 grid grid-cols-3 gap-2">
                    {existingImageUrls.map((url, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={`existing-${index}`} src={url} alt={`Existing ${index + 1}`} className="h-20 w-full object-cover rounded-md border" />
                    ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-images" className="text-right col-span-1 mt-2">Replace Images</Label>
              <Input id="edit-images" name="images" type="file" multiple accept="image/png, image/jpeg, image/webp, image/gif" onChange={handleFileChange} className="col-span-3" />
            </div>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right col-span-1 mt-2">New Previews</Label>
                <div className="col-span-3 grid grid-cols-3 gap-2">
                  {imagePreviews.map((previewUrl, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={`new-preview-${index}`} src={previewUrl} alt={`New Preview ${index + 1}`} className="h-20 w-full object-cover rounded-md border" />
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-dataAiHint" className="text-right col-span-1">Image Hint</Label>
              <Input id="edit-dataAiHint" name="dataAiHint" value={formState.dataAiHint} onChange={handleChange} className="col-span-3" placeholder="e.g., modern apartment (max 2 words)"/>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyModal;
