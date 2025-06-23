import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, LoaderCircle, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAllProductsQuery } from "@/hooks/queries/useAllProductsQuery";
import type { ProductSummary } from "@/types";

function HighlightProductCard({ product }: { product: ProductSummary }) {
  return (
    <Card className="hover:shadow-primary/25 hover:border-primary/40 overflow-hidden transition-shadow duration-400 hover:shadow-lg">
      <CardHeader className="p-2">
        <div className="relative">
          <img
            src={product.image_on_list}
            alt={product.name_on_list}
            className="h-56 w-full object-contain transition-transform duration-400 hover:scale-125"
          />
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="line-clamp-2 text-sm font-medium">{product.name_on_list}</h3>
      </CardContent>
      <CardFooter className="flex items-center justify-between px-6 py-4">
        <p className="text-primary text-lg font-bold">{parseInt(product.price_on_list).toLocaleString("vi-VN")}đ</p>
        <Button size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  );
}


function HighlightProductsCarousel() {
  const { data: paginatedData, isLoading, isError, error } = useAllProductsQuery(1, 10,{});

  if (isLoading) {
    return (
      <div className="flex justify-center py-12"> 
        <LoaderCircle className="text-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-12 text-center text-red-600">
        <p>
          Could not load products. Please try again later. <br />{" "}
          <span className="text-sm text-gray-500">({error.message})</span>
        </p>
      </div>
    );
  }

  const products = paginatedData?.data ?? [];

  if (products.length === 0) {
    return (
      <div className="flex justify-center py-12 text-center text-gray-500">
        <p>No featured products available at the moment.</p>
      </div>
    );
  }

  return (
    <Carousel className="mb-12" plugins={[Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false })]}>
      <CarouselContent className="py-4">
        {products.map((product) => (
          <CarouselItem key={product._id} className="md:basis-1/2 lg:basis-1/4">
            <HighlightProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default function HighlightProducts(): React.JSX.Element {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="prose-h2 text-2xl font-bold">Sản phẩm nổi bật</h2>
        
          <Link to="/products" className="text-primary flex items-center hover:underline">
            Xem tất cả
            <ChevronRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
        <HighlightProductsCarousel />
      </div>
    </section>
  );
}
