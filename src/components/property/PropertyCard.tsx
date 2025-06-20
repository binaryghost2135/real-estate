
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, BedDouble, Bath, Square as SquareIcon, Pencil, Trash2 } from 'lucide-react';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
  onLike: (propertyId: string) => void;
  isLiked: boolean;
  isAdminLoggedIn?: boolean;
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: string) => void;
}

const PropertyCard: FC<PropertyCardProps> = ({ property, onClick, onLike, isLiked, isAdminLoggedIn, onEdit, onDelete }) => {
  const { id, name, address, price, bedrooms, bathrooms, area, imageUrls, dataAiHint } = property;
  const displayImageUrl = imageUrls?.[0] || `https://placehold.co/600x400.png`;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(property);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <Card
      className="overflow-hidden transform hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer group flex flex-col h-full"
      onClick={() => onClick(property)}
      aria-label={`View details for ${name}`}
    >
      <div className="relative w-full h-52">
        <Image
          src={displayImageUrl}
          alt={`Image of ${name}`}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={dataAiHint || 'property image'}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/600x400.png`;
            (e.target as HTMLImageElement).srcset = "";
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 rounded-full p-1.5 backdrop-blur-sm h-9 w-9"
          onClick={handleLikeClick}
          aria-label={isLiked ? 'Unlike property' : 'Like property'}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        </Button>
      </div>
      <CardHeader className="p-4 pb-2">
        <p className="text-primary font-semibold text-lg">{price}</p>
        <CardTitle className="text-xl font-bold text-card-foreground mb-1 truncate group-hover:text-primary">{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2 flex-grow">
        <p className="text-muted-foreground text-sm mb-3 flex items-start">
          <MapPin className="w-4 h-4 mr-1.5 mt-0.5 shrink-0" /> {address}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2 border-t">
        <div className="flex flex-wrap justify-between items-center text-muted-foreground text-xs sm:text-sm w-full gap-2">
          <div className="flex items-center space-x-1.5"><BedDouble className="w-4 h-4 sm:w-5 sm:h-5" /> <span>{bedrooms} Beds</span></div>
          <div className="flex items-center space-x-1.5"><Bath className="w-4 h-4 sm:w-5 sm:h-5" /> <span>{bathrooms} Baths</span></div>
          <div className="flex items-center space-x-1.5"><SquareIcon className="w-4 h-4 sm:w-5 sm:h-5" /> <span>{area}</span></div>
          {isAdminLoggedIn && onEdit && onDelete && (
            <div className="flex items-center space-x-2 mt-2 sm:mt-0 ml-auto">
              <Button variant="outline" size="icon" onClick={handleEditClick} className="h-7 w-7 sm:h-8 sm:w-8">
                <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="destructive" size="icon" onClick={handleDeleteClick} className="h-7 w-7 sm:h-8 sm:w-8">
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
