import { Check, LoaderCircle, ShoppingCart, XCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth.context";
import { useAddToCartMutation } from "@/hooks/mutations/useAddToCartMutation";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { ProductBadges } from "./ProductBadges";

interface ProductStockAndActionsProps {
  product: Product;
  filterIdToNameMap: Map<string, string>;
}

export function ProductStockAndActions({ product, filterIdToNameMap }: ProductStockAndActionsProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCartMutation();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to continue", {
        description: "You need to be logged in to add items to your cart.",
      });
      navigate("/auth/login", { state: { from: location }, replace: true });
      return;
    }

    addToCart({
      ProductID: product._id,
      Quantity: 1,
    });
  };

  const isOutOfStock = (product.quantity || 0) <= 0;

  return (
    <div className="space-y-4">
      <p className="text-gray-700">{product.engName_detail}</p>
      <ProductBadges product={product} filterIdToNameMap={filterIdToNameMap} />

      {isOutOfStock ? (
        <div className="flex items-center font-medium text-red-600">
          <XCircle className="mr-1 h-5 w-5" />
          <span>Out of Stock</span>
        </div>
      ) : (
        <div className="flex items-center text-green-600">
          <Check className="mr-1 h-5 w-5" />
          <span>In Stock ({product.quantity} available)</span>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <Button className="flex-1" onClick={handleAddToCart} disabled={isAddingToCart || isOutOfStock}>
          {isAddingToCart ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )}
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </Button>
        <Button variant="outline" className="flex-1" disabled={isOutOfStock}>
          Buy Now
        </Button>
      </div>
    </div>
  );
}