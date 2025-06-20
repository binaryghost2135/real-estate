
"use server";

import type { Property } from '@/types'; // Updated import
import { generatePropertyInsights as getAIInsights, type PropertyInsightsInput, type PropertyInsightsOutput } from '@/ai/flows/property-insights';

// toggleLikeProperty function has been removed as Firebase Firestore is no longer used.
// Like functionality will be handled client-side in page.tsx.

export async function generatePropertyInsightsServerAction(properties: Property[]): Promise<PropertyInsightsOutput | { error: string }> {
  if (!properties || properties.length === 0) {
    return { error: "No properties provided for insights." };
  }

  // Map properties to fit the PropertyInsightsInput schema
  const insightInput: PropertyInsightsInput = {
    properties: properties.map(p => ({
      id: p.id,
      type: p.type,
      name: p.name,
      address: p.address,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area: p.area,
      description: p.description,
      imageUrls: p.imageUrls,
    }))
  };
  
  try {
    const result = await getAIInsights(insightInput);
    return result;
  } catch (error) {
    console.error("Error generating AI property insights:", error);
    return { error: "Failed to generate AI insights." };
  }
}
