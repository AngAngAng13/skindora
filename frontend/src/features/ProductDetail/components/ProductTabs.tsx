import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@/types";
import { ReviewList } from "./ReviewList";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Card className="mt-12 py-0">
      <Tabs defaultValue="description">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <CardContent className="prose prose-sm max-w-none">
          <TabsContent value="description">
            <div dangerouslySetInnerHTML={{ __html: product.description_detail.rawHtml }} />
          </TabsContent>
          <TabsContent value="ingredients">
            <div dangerouslySetInnerHTML={{ __html: product.ingredients_detail.rawHtml }} />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewList productId={product._id} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}