import { Heart, LoaderCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface ProductHeaderProps {
  product: Product;
  onToggleWishlist: () => void;
  isAddingToWishlist: boolean;
  isRemovingFromWishlist: boolean;
  isInWishlist: boolean;
}

export function ProductHeader({
  product,
  isAddingToWishlist,
  isInWishlist,
  isRemovingFromWishlist,
  onToggleWishlist,
}: ProductHeaderProps) {
  const isWishlistLoading = isAddingToWishlist || isRemovingFromWishlist;

  return (
    <div>
      <div className="flex items-start justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          onClick={onToggleWishlist}
          disabled={isWishlistLoading}
        >
          {isWishlistLoading ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <Heart
              className={`h-5 w-5 transition-colors ${
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          )}
        </Button>
      </div>
      <h1 className="mt-2 text-3xl font-bold">{product.productName_detail}</h1>
      <div className="mt-2 flex items-center">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-600">
          {product.rating || 0} ({product.reviews || 0} reviews)
        </span>
      </div>
    </div>
  );
}