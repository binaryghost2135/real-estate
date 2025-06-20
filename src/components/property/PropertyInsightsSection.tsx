
"use client";

import type { FC } from 'react';
import { useState, useTransition } from 'react';
// Button import removed as it's no longer used
// Loader2 import removed as it's no longer used
import { Wand2 } from 'lucide-react'; // Wand2 is used in AlertDialogTitle
import {
  AlertDialog,
  AlertDialogAction,
  // AlertDialogCancel, // No longer used
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Property } from '@/types'; 
import { generatePropertyInsightsServerAction } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";

interface PropertyInsightsSectionProps {
  properties: Property[];
}

const PropertyInsightsSection: FC<PropertyInsightsSectionProps> = ({ properties }) => {
  const [isPending, startTransition] = useTransition();
  const [insights, setInsights] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // This function is no longer triggered by UI elements within this component
  // after the button's removal.
  const handleGenerateInsights = () => {
    if (properties.length === 0) {
      toast({
        title: "No Properties",
        description: "There are no properties in the current view to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    startTransition(async () => {
      const result = await generatePropertyInsightsServerAction(properties);
      if ('error' in result) {
        toast({
          title: "Error Generating Insights",
          description: result.error,
          variant: "destructive",
        });
        setInsights(null);
      } else {
        setInsights(result.insights);
        setIsModalOpen(true);
      }
    });
  };

  return (
    <>
      {/* The div className="my-8 text-center" which contained the Button and paragraph has been removed. */}

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-2xl">
              <Wand2 className="mr-2 h-6 w-6 text-primary" />
              AI Property Insights
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-left whitespace-pre-line">
              {insights || "No insights generated."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsModalOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PropertyInsightsSection;
