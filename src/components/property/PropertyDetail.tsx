
"use client";

import type { FC } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, MapPin, BedDouble, Bath, Square as SquareIcon } from 'lucide-react';
import type { Property } from '@/types'; // Updated import

interface PropertyDetailProps {
  property: Property | null;
  onBack: () => void;
}

const PropertyDetail: FC<PropertyDetailProps> = ({ property, onBack }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property) return null;

  const { name, address, price, bedrooms, bathrooms, area, description, imageUrls, dataAiHint } = property;

  const goToNext = () => setCurrentImageIndex(i => (i + 1) % imageUrls.length);
  const goToPrev = () => setCurrentImageIndex(i => (i - 1 + imageUrls.length) % imageUrls.length);

  const currentImageUrl = imageUrls[currentImageIndex] || `https://placehold.co/800x600.png`;

  return (
    <section className="container mx-auto p-4 py-8 animate-fade-in">
      <Button onClick={onBack} variant="outline" className="mb-6 group">
        <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Listings
      </Button>

      <Card className="shadow-xl">
        <CardContent className="p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative w-full h-[350px] sm:h-[450px] rounded-lg shadow-md mb-4 overflow-hidden bg-muted">
                <Image
                  src={currentImageUrl}
                  alt={`${name} image ${currentImageIndex + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity duration-300"
                  data-ai-hint={dataAiHint || 'property interior'}
                  priority={true} // Mark main image as priority
                   onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/800x600.png`;
                    (e.target as HTMLImageElement).srcset = "";
                  }}
                />
                {imageUrls.length > 1 && (
                  <>
                    <Button onClick={goToPrev} variant="outline" size="icon" className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card h-9 w-9">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button onClick={goToNext} variant="outline" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card h-9 w-9">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
              {imageUrls.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {imageUrls.map((url, index) => (
                    <button key={index} onClick={() => setCurrentImageIndex(index)} className={`relative w-24 h-16 rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary ${currentImageIndex === index ? 'border-primary' : 'border-transparent'}`}>
                      <Image 
                        src={url} 
                        alt={`Thumbnail ${index + 1}`} 
                        layout="fill" 
                        objectFit="cover"
                        data-ai-hint={dataAiHint || 'property thumbnail'}
                         onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/150x100.png`;
                          (e.target as HTMLImageElement).srcset = "";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-extrabold text-card-foreground mb-2 font-headline">{name}</h2>
              <p className="text-primary font-bold text-3xl mb-4">{price}</p>
              <Card className="bg-muted/50 p-4 rounded-lg shadow-inner border mb-6">
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-xl font-bold text-card-foreground">Details</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-3 text-foreground/80">
                    <li className="flex items-center text-base"><BedDouble className="mr-3 h-5 w-5 text-primary"/> <strong className="w-24 font-medium">Bedrooms:</strong> {bedrooms}</li>
                    <li className="flex items-center text-base"><Bath className="mr-3 h-5 w-5 text-primary"/> <strong className="w-24 font-medium">Bathrooms:</strong> {bathrooms}</li>
                    <li className="flex items-center text-base"><SquareIcon className="mr-3 h-5 w-5 text-primary"/> <strong className="w-24 font-medium">Area:</strong> {area}</li>
                    <li className="flex items-start text-base"><MapPin className="mr-3 h-5 w-5 text-primary mt-0.5"/> <strong className="w-24 font-medium flex-shrink-0">Address:</strong> {address}</li>
                  </ul>
                </CardContent>
              </Card>
              <h3 className="text-xl font-bold text-card-foreground mb-2 font-headline">Description</h3>
              <p className="text-foreground/80 text-base mb-6 leading-relaxed">{description}</p>
              <Button className="w-full text-lg py-3 transform hover:scale-105 transition-all duration-300">
                Contact Agent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PropertyDetail;
