"use server";

import { revalidatePath } from 'next/cache';
import { db, appId as firebaseAppId, type Property } from '@/lib/firebase'; // Ensure Property type is imported
import { doc, runTransaction, getDoc, setDoc } from 'firebase/firestore';
import { generatePropertyInsights as getAIInsights, type PropertyInsightsInput, type PropertyInsightsOutput } from '@/ai/flows/property-insights';

export async function toggleLikeProperty(userId: string, propertyId: string): Promise<{ success: boolean; isLiked: boolean; error?: string }> {
  if (!userId) {
    return { success: false, isLiked: false, error: "User not authenticated." };
  }

  const likesDocRef = doc(db, `artifacts/${firebaseAppId}/users/${userId}/favorites/likedProperties`);
  let finalIsLiked = false;

  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(likesDocRef);
      let currentLikes: string[] = [];
      if (sfDoc.exists()) {
        currentLikes = sfDoc.data()?.ids || [];
      }
      
      let newLikes: string[];
      if (currentLikes.includes(propertyId)) {
        newLikes = currentLikes.filter(id => id !== propertyId); // Unlike
        finalIsLiked = false;
      } else {
        newLikes = [...currentLikes, propertyId]; // Like
        finalIsLiked = true;
      }
      transaction.set(likesDocRef, { ids: newLikes }, { merge: !sfDoc.exists() }); // Use set with merge true if doc might not exist
    });
    revalidatePath('/'); // Revalidate the page to reflect changes
    return { success: true, isLiked: finalIsLiked };
  } catch (error) {
    console.error("Transaction failed: ", error);
    return { success: false, isLiked: false, error: "Failed to update like status." };
  }
}


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
