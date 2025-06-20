
"use client";

import type { FC } from 'react';
import PropertyCard from './PropertyCard';
import type { Property } from '@/types'; // Updated import
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyListProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onLike: (propertyId: string) => void;
  likedIds: string[];
  isLoading: boolean;
}

const PropertyList: FC<PropertyListProps> = ({ properties, onPropertyClick, onLike, likedIds, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[208px] w-full rounded-xl" />
            <div className="space-y-2 p-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {properties.length > 0 ? (
        properties.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            onClick={onPropertyClick} 
            onLike={onLike} 
            isLiked={likedIds.includes(property.id)} 
          />
        ))
      ) : (
        <p className="col-span-full text-center text-muted-foreground text-xl py-10">No properties found for this selection.</p>
      )}
    </div>
  );
};

export default PropertyList;
