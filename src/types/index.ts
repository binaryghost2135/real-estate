
export interface Property {
  id: string;
  type: 'buy' | 'rent';
  name: string;
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  imageUrls: string[];
  dataAiHint?: string; // Optional for AI hints on images
}
