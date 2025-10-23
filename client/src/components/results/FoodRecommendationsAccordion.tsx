import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FoodRecommendation } from '@/hooks/useAnalysisData';

interface FoodRecommendationsAccordionProps {
  foodRecommendations: FoodRecommendation[];
}

const FoodRecommendationsAccordion: React.FC<FoodRecommendationsAccordionProps> = ({ foodRecommendations }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Rekomendasi Makanan</CardTitle>
        <CardDescription>Berikut adalah saran makanan yang disesuaikan dengan kondisi Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        {foodRecommendations && foodRecommendations.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {foodRecommendations.map((food, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="font-bold text-lg">{food.category}</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-md">
                    {food.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Tidak ada rekomendasi makanan.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodRecommendationsAccordion;
