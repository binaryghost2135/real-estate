
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
import { X, Trash2, RotateCcw } from 'lucide-react';
import type { Property } from '@/types';
import Image from 'next/image';

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: Property) => void;
  property: Property | null;
}

type EditPropertyFormState = Omit<Property, 'id' | 'imageUrls'>;

interface ManagedImage {
  url: string;
  isMarkedForDeletion: boolean;
  isNewlyUploaded?: boolean; // To differentiate between existing and just added for preview
  file?: File; // For newly uploaded files before conversion
}

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
  
  const [managedImages, setManagedImages] = useState<ManagedImage[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<FileList | null>(null);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);


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
      setManagedImages(property.imageUrls.map(url => ({ url, isMarkedForDeletion: false })));
      setNewImageFiles(null);
      setNewImagePreviews([]); // Clear new previews when modal reopens
    }
  }, [property, isOpen]);

  if (!property) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setNewImageFiles(files);
    if (files) {
      const currentPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      newImagePreviews.forEach(url => URL.revokeObjectURL(url)); // Clean up old new previews
      setNewImagePreviews(currentPreviews);
    } else {
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
      setNewImagePreviews([]);
    }
  };

  const toggleDeleteImage = (index: number) => {
    setManagedImages(prev => 
      prev.map((img, i) => 
        i === index ? { ...img, isMarkedForDeletion: !img.isMarkedForDeletion } : img
      )
    );
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

    let finalImageUrls: string[] = managedImages
      .filter(img => !img.isMarkedForDeletion)
      .map(img => img.url);

    if (newImageFiles && newImageFiles.length > 0) {
      try {
        const newDataUris = await Promise.all(Array.from(newImageFiles).map(fileToDataUri));
        finalImageUrls = [...finalImageUrls, ...newDataUris];
      } catch (error) {
        console.error("Error converting new files to Data URIs:", error);
        alert("Error processing new images. Please try again.");
        return;
      }
    }
    
    const updatedProperty: Property = {
      ...property,
      ...formState,
      bedrooms: Number(formState.bedrooms),
      bathrooms: Number(formState.bathrooms),
      imageUrls: finalImageUrls,
    };

    onSubmit(updatedProperty);
    newImagePreviews.forEach(url => URL.revokeObjectURL(url)); // Clean up previews
    setNewImagePreviews([]);
    setNewImageFiles(null);
  };

  const handleCloseModal = () => {
    onClose();
    newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setNewImagePreviews([]);
    setManagedImages([]);
    setNewImageFiles(null);
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
            {/* Form fields for property details (name, type, address, etc.) */}
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
            
            {/* Current Images Section */}
            {managedImages.length > 0 && (
                 <div className="grid grid-cols-1 gap-2 mt-4">
                    <Label className="col-span-full font-medium">Current Images</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {managedImages.map((image, index) => (
                        <div key={`current-${index}`} className="relative group">
                           <Image 
                                src={image.url} 
                                alt={`Current image ${index + 1}`} 
                                width={100} 
                                height={75} 
                                className={`w-full h-20 object-cover rounded-md border ${image.isMarkedForDeletion ? 'opacity-50 ring-2 ring-destructive' : ''}`}
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x75.png'; }}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className={`absolute top-1 right-1 h-6 w-6 p-1 z-10 ${image.isMarkedForDeletion ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-600 hover:bg-red-700'}`}
                                onClick={() => toggleDeleteImage(index)}
                                title={image.isMarkedForDeletion ? "Undo Delete" : "Delete Image"}
                            >
                                {image.isMarkedForDeletion ? <RotateCcw className="h-3 w-3" /> : <Trash2 className="h-3 w-3" />}
                            </Button>
                        </div>
                    ))}
                    </div>
                </div>
            )}

            {/* Add New Images Section */}
            <div className="grid grid-cols-4 items-start gap-4 mt-4">
              <Label htmlFor="edit-new-images" className="text-right col-span-1 mt-2">Add New Images</Label>
              <Input id="edit-new-images" name="newImages" type="file" multiple accept="image/png, image/jpeg, image/webp, image/gif" onChange={handleFileChange} className="col-span-3" />
            </div>
            {newImagePreviews.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right col-span-1 mt-2">New Previews</Label>
                <div className="col-span-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {newImagePreviews.map((previewUrl, index) => (
                    <Image 
                        key={`new-preview-${index}`} 
                        src={previewUrl} 
                        alt={`New Preview ${index + 1}`} 
                        width={100} 
                        height={75} 
                        className="h-20 w-full object-cover rounded-md border" 
                    />
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

    