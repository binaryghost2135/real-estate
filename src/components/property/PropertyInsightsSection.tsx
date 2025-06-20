"use client";

import type { FC } from 'react';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Property } from '@/lib/firebase';
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
      <div className="my-8 text-center">
        <Button
          onClick={handleGenerateInsights}
          disabled={isPending || properties.length === 0}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          Get AI Property Insights
        </Button>
        {properties.length === 0 && <p className="text-sm text-muted-foreground mt-2">No properties visible to analyze.</p>}
      </div>

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
