'use server';

/**
 * @fileOverview AI-powered property insights flow.
 *
 * - generatePropertyInsights - A function that generates insights about a list of properties.
 * - PropertyInsightsInput - The input type for the generatePropertyInsights function.
 * - PropertyInsightsOutput - The return type for the generatePropertyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PropertySchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  address: z.string(),
  price: z.string(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  area: z.string(),
  description: z.string(),
  imageUrls: z.array(z.string()),
});

const PropertyInsightsInputSchema = z.object({
  properties: z.array(PropertySchema).describe('A list of property objects.'),
});
export type PropertyInsightsInput = z.infer<typeof PropertyInsightsInputSchema>;

const PropertyInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-generated insights about the properties.'),
});
export type PropertyInsightsOutput = z.infer<typeof PropertyInsightsOutputSchema>;

export async function generatePropertyInsights(input: PropertyInsightsInput): Promise<PropertyInsightsOutput> {
  return propertyInsightsFlow(input);
}

const propertyInsightsPrompt = ai.definePrompt({
  name: 'propertyInsightsPrompt',
  input: {schema: PropertyInsightsInputSchema},
  output: {schema: PropertyInsightsOutputSchema},
  prompt: `You are an AI real estate expert providing insights on a list of properties.

  Analyze the following properties and generate insightful comments. Consider valuation estimations, comparisons, and highlight any potential hidden gems or unique amenities.

  Properties:
  {{#each properties}}
  - Name: {{this.name}}, Address: {{this.address}}, Price: {{this.price}}, Bedrooms: {{this.bedrooms}}, Bathrooms: {{this.bathrooms}}, Area: {{this.area}}, Description: {{this.description}}
  {{/each}}
  
  Insights:`,
});

const propertyInsightsFlow = ai.defineFlow(
  {
    name: 'propertyInsightsFlow',
    inputSchema: PropertyInsightsInputSchema,
    outputSchema: PropertyInsightsOutputSchema,
  },
  async input => {
    const {output} = await propertyInsightsPrompt(input);
    return output!;
  }
);
