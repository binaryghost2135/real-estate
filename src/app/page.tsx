
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Property } from '@/types'; // Updated import

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyList from '@/components/property/PropertyList';
import PropertyDetail from '@/components/property/PropertyDetail';
import FilterBar from '@/components/property/FilterBar';
import SellPropertyModal, { type SellPropertyDetails } from '@/components/property/SellPropertyModal';
import PropertyInsightsSection from '@/components/property/PropertyInsightsSection';
import { useToast } from "@/hooks/use-toast";

// --- Mock Data ---
const mockProperties: Property[] = [
    { id: 'p1', type: 'buy', name: 'Spacious 3BHK in Lokhandwala', address: 'Lokhandwala Complex, Kandivali East', price: '₹2.5 Cr', bedrooms: 3, bathrooms: 3, area: '1450 sqft', description: 'Luxurious apartment with modern amenities, prime location, and excellent connectivity. Features include a modular kitchen, designer bathrooms, ample natural light, and a dedicated parking space. The building offers a gymnasium, swimming pool, and 24/7 security.', imageUrls: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8aG9tZXxlbnwwfHx8fDE3NTA0MTE5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwwfHx8fDE3MTQwOTM0ODZ8MA&ixlib=rb-4.0.3&q=80&w=1080', 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fHx8MTY4MzczNTY2N3ww&ixlib=rb-4.0.3&q=80&fm=jpg&fit=max&w=1080&h=720', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fHx8MTY4MzczNTY2N3ww&ixlib=rb-4.0.3&q=80&fm=jpg&fit=max&w=1080&h=720'], dataAiHint: "modern apartment" },
    { id: 'p2', type: 'rent', name: 'Cozy 2BHK near Akurli Road', address: 'Akurli Road, Kandivali East', price: '₹45,000/month', bedrooms: 2, bathrooms: 2, area: '950 sqft', description: 'A comfortable and well-ventilated apartment ideal for small families. Located in a peaceful neighborhood with easy access to schools, hospitals, and local markets. Comes semi-furnished with wardrobes and kitchen cabinets. Pet-friendly building.', imageUrls: ['https://images.unsplash.com/photo-1576941089067-2cd7367ce870?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHw3fHxzZW1pLWRldGFjaGVkJTIwaG91c2V8ZW58MHx8fHwxNzAxOTQzNDU2fDA&ixlib=rb-4.0.3&q=80&w=1080', 'https://images.unsplash.com/photo-1613576356715-e214d0263303?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHwxOHx8Y296eSUyMHJvb218ZW58MHx8fHwxNzExNzQ5MDc4fDA&ixlib=rb-4.0.3&q=80&w=1080', 'https://images.unsplash.com/photo-1550015509-0d196f131a4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHwzMHx8Y296eSUyMGhvbWUlMjBraXRjaGVufGVufDB8fHx8MTcxMTc0OTA3OHww&ixlib=rb-4.0.3&q=80&w=1080',], dataAiHint: "cozy house"},
    { id: 'p3', type: 'buy', name: 'Premium 4BHK Penthouse', address: 'Poisar, Kandivali West', price: '₹4.2 Cr', bedrooms: 4, bathrooms: 4, area: '2500 sqft', description: 'An exquisite penthouse offering unparalleled luxury and breathtaking city views. Features a private terrace, Jacuzzi, smart home automation, and access to exclusive rooftop amenities. Perfect for those seeking an opulent lifestyle.', imageUrls: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHw5fHxtb2Rlcm4lMjBob3VzZXxlbnwwfHx8fDE3MDE5NDM0NTZ8MA&ixlib=rb-4.0.3&q=80&w=1080', 'https://images.unsplash.com/photo-1582063717204-c11cc28f73e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHwzNXx8bHV4dXJ5JTIwaG9tZXxlbnwwfHx8fDE3MTE3NDk1MTl8MA&ixlib=rb-4.0.3&q=80&w=1080', 'https://images.unsplash.com/photo-1588725807985-7977a4198263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHwxOXx8bHV4dXJ5JTIwcm9vbXxlbnwwfHx8fDE3MTE3NDk1MTl8MA&ixlib=rb-4.0.3&q=80&w=1080',], dataAiHint: "luxury penthouse"},
    { id: 'p4', type: 'rent', name: 'Studio Apartment, Link Road', address: 'Link Road, Kandivali West', price: '₹22,000/month', bedrooms: 1, bathrooms: 1, area: '400 sqft', description: 'A compact and efficiently designed studio apartment in a highly accessible location. Ideal for singles or working professionals. Close to public transport and entertainment hubs. Includes a compact kitchenette and attached bathroom.', imageUrls: ['https://images.unsplash.com/photo-1549517045-bc93de06f52e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHwyMHx8c3R1ZGlvJTIwYXBhdHJtZW50fGVufDB8fHx8MTcwMTk0MzQ1Nnw&ixlib=rb-4.0.3&q=80&w=1080', 'https://images.unsplash.com/photo-1628108427909-51a8f9b9a67a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHwzMXx8c21hbGwlMjBhcGFydG1lbnR8ZW58MHx8fHwxNzExNzQ5NTg0fDA&ixlib=rb-4.0.3&q=80&w=1080', 'https://images.unsplash.com/photo-1605342930722-e42253303c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHw2MHx8c21hbGwlMjBraXRjaGVufGVufDB8fHx8MTcxMTc0OTU4NHww&ixlib=rb-4.0.3&q=80&w=1080',], dataAiHint: "studio apartment" },
    { id: 'p5', type: 'buy', name: 'Modern 2BHK at Thakur Village', address: 'Thakur Village, Kandivali East', price: '₹1.8 Cr', bedrooms: 2, bathrooms: 2, area: '1100 sqft', description: 'A contemporary 2BHK in the vibrant Thakur Village. Known for its green spaces, excellent schools, and family-friendly environment. The apartment features spacious rooms, a balcony, and access to community parks and clubs.', imageUrls: ['https://images.unsplash.com/photo-1588880331179-bc2240b904d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHwxMnx8ZmFtaWx5JTIwaG9tZXxlbnwwfHx8fDE3MDE5NDM1NDd8MA&ixlib=rb-4.0.3&q=80&w=1080', 'https://images.unsplash.com/photo-1592595896349-ad7d159114f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHwyMHx8ZmFtaWx5JTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3MTE3NDk1MTl8MA&ixlib=rb-4.0.3&q=80&w=1080', 'https://images.unsplash.com/photo-1628108427909-51a8f9b9a67a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHwyOXx8ZmFtaWx5JTIwYmVkcm9vbXxlbnwwfHx8fDE3MTE3NDk1MTl8MA&ixlib=rb-4.0.3&q=80&w=1080',], dataAiHint: "family home"},
    { id: 'p6', type: 'rent', name: 'Large 3BHK on SV Road', address: 'SV Road, Kandivali West', price: '₹60,000/month', bedrooms: 3, bathrooms: 3, area: '1300 sqft', description: 'Spacious and well-located 3BHK apartment on the bustling S.V. Road. Offers excellent connectivity to various parts of Mumbai. Ideal for large families looking for convenience and ample space. Includes covered parking.', imageUrls: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHw0OXx8YXBwYXJ0bWVudHxlbnwwfHx8fDE3MDE5NDM1NDh8MA&ixlib=rb-4.0.3&q=80&w=1080', 'https://images.unsplash.com/photo-1554995207-c18c1533604d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHw1Nnx8YXBhdHJtZW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzExNzQ5NTg0fDA&ixlib=rb-4.0.3&q=80&w=1080', 'https://images.unsplash.com/photo-1522703131707-160a22f306d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4MTN8MHwxfHNlYXJjaHwxMDF8fGtpbmclMjBzaXplJTIwYmVkcm9vbXxlbnwwfHx8fDE3MTE3NDk1ODR8MA&ixlib=rb-4.0.3&q=80&w=1080',], dataAiHint: "spacious apartment"},
];


export default function HomePage() {
    const [allProperties, setAllProperties] = useState<Property[]>(mockProperties);
    const [likedPropertyIds, setLikedPropertyIds] = useState<string[]>([]);
    const [filterType, setFilterType] = useState<'buy' | 'rent' | 'favorites'>('buy');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(false); // No complex loading initially
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const { toast } = useToast();

    // Firebase Auth & Data Seeding Effect removed
    // Firestore Data Fetching Effect removed

    // --- Memoized Filtering Logic ---
    const filteredProperties = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return allProperties.filter(p => {
            const matchesSearch = !lowerCaseSearchTerm ||
                p.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                p.address.toLowerCase().includes(lowerCaseSearchTerm) ||
                p.description.toLowerCase().includes(lowerCaseSearchTerm);
            
            if (!matchesSearch) return false;

            if (filterType === 'favorites') {
                return likedPropertyIds.includes(p.id);
            }
            return p.type === filterType;
        });
    }, [allProperties, filterType, searchTerm, likedPropertyIds]);

    // --- Event Handlers ---
    const handlePropertyClick = (property: Property) => setSelectedProperty(property);
    const handleBackToListings = () => setSelectedProperty(null);
    
    const handleLike = (propertyId: string) => {
        const isCurrentlyLiked = likedPropertyIds.includes(propertyId);
        if (isCurrentlyLiked) {
            setLikedPropertyIds(prevLikedIds => prevLikedIds.filter(id => id !== propertyId));
            toast({ title: "Removed from Favorites", variant: "default" });
        } else {
            setLikedPropertyIds(prevLikedIds => [...prevLikedIds, propertyId]);
            toast({ title: "Added to Favorites", variant: "default" });
        }
    };
    
    const handleNavigation = (filter: 'buy' | 'rent' | 'favorites') => {
        setFilterType(filter);
        setSelectedProperty(null); // Go back to list view when filter changes
    };

    const handleSellSubmit = (details: SellPropertyDetails) => {
        const { propertyType, location, price, contact } = details;
        const message = `Hi, I want to list my property for sale.
Details:
- Property Type: ${propertyType}
- Location: ${location}
- Expected Price: ${price}
- Contact: ${contact}`;
        
        const whatsappUrl = `https://wa.me/919899575955?text=${encodeURIComponent(message)}`; // Replace with actual agent number if needed
        window.open(whatsappUrl, '_blank');
        setIsSellModalOpen(false);
        toast({ title: "Information Sent", description: "Your property details are ready to be sent via WhatsApp.", variant: "default" });
    };

    return (
        <div className="min-h-screen bg-background font-body antialiased flex flex-col">
            <Header onNavigate={handleNavigation} onOpenSellModal={() => setIsSellModalOpen(true)} />
            <SellPropertyModal 
                isOpen={isSellModalOpen} 
                onClose={() => setIsSellModalOpen(false)} 
                onSubmit={handleSellSubmit}
            />
            <main className="flex-grow">
                {selectedProperty ? (
                    <PropertyDetail property={selectedProperty} onBack={handleBackToListings} />
                ) : (
                    <section className="container mx-auto p-4 py-8">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-center mb-4 font-headline">
                            Find Your Dream Home in <span className="text-primary">Kandivali</span>
                        </h2>
                        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto text-base sm:text-lg">Explore our curated list of properties for sale and rent. Use the filters to narrow down your search.</p>
                        
                        <FilterBar 
                           onFilterChange={setFilterType}
                           currentFilter={filterType}
                           searchTerm={searchTerm}
                           onSearchTermChange={setSearchTerm}
                        />
                        
                        <PropertyList 
                           properties={filteredProperties}
                           onPropertyClick={handlePropertyClick}
                           onLike={handleLike}
                           likedIds={likedPropertyIds}
                           isLoading={isLoading}
                        />
                        <PropertyInsightsSection properties={filteredProperties} />
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}

