import { ArrowLeft, Check, Heart, LoaderCircle, Package, ShoppingCart, Star, Truck, XCircle } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth.context";
import { useAddToCartMutation } from "@/hooks/mutations/useAddToCartMutation";
import { useAddToWishlistMutation } from "@/hooks/mutations/useAddToWishlistMutation";
import { useRemoveFromWishlistMutation } from "@/hooks/mutations/useRemoveFromWishlistMutation";
import { useFilterOptionsQuery } from "@/hooks/queries/useFilterOptionsQuery";
import { useProductByIdQuery } from "@/hooks/queries/useProductByIdQuery";
import { useWishlistQuery } from "@/hooks/queries/useWishlistQuery";
import type { Product } from "@/types";

import { ProductImageGallery } from "./components/ProductImageGallery";

interface ProductBadgesProps {
  product: Product;
  filterIdToNameMap: Map<string, string>;
}
function ProductBadges({ product, filterIdToNameMap }: ProductBadgesProps) {
  const productBadges = useMemo(() => {
    if (!product || filterIdToNameMap.size === 0) return [];
    const badges: { id: string; name: string }[] = [];
    for (const [key, value] of Object.entries(product)) {
      if (key.startsWith("filter_") && typeof value === "string" && value) {
        const name = filterIdToNameMap.get(value);
        if (name) badges.push({ id: value, name });
      }
    }
    return badges;
  }, [product, filterIdToNameMap]);
  return (
    <div className="flex flex-wrap gap-2">
      {productBadges.map((badge) => (
        <Badge key={badge.id} variant="outline" className="mb-2">
          {badge.name}
        </Badge>
      ))}
    </div>
  );
}

interface ProductHeaderProps {
  product: Product;
  onToggleWishlist: () => void;
  isAddingToWishlist: boolean;
  isRemovingFromWishlist: boolean;
  isInWishlist: boolean;
}
function ProductHeader({
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
              className={`h-5 w-5 transition-colors ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"}`}
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
              className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
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

interface ProductPriceProps {
  product: Product;
}
function ProductPrice({ product }: ProductPriceProps) {
  return (
    <div className="space-y-2">
      <p className="text-2xl font-bold">{parseInt(product.price_on_list).toLocaleString("vi-VN")}₫</p>
      {product.originalPrice && (
        <p className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString("vi-VN")}₫</p>
      )}
    </div>
  );
}

interface ProductStockAndActionsProps {
  product: Product;
  filterIdToNameMap: Map<string, string>;
}
function ProductStockAndActions({ product, filterIdToNameMap }: ProductStockAndActionsProps) {
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

function ProductShippingAndReturns() {
  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        <Truck className="h-5 w-5 text-gray-600" />
        <div>
          <p className="font-medium">Free Shipping</p>
          <p className="text-sm text-gray-600">For orders over 500,000₫</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Package className="h-5 w-5 text-gray-600" />
        <div>
          <p className="font-medium">Returns</p>
          <p className="text-sm text-gray-600">30-day return policy</p>
        </div>
      </div>
    </div>
  );
}

interface ProductTabsProps {
  product: Product;
}
function ProductTabs({ product }: ProductTabsProps) {
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
            <h3 className="text-lg font-medium">Customer Reviews</h3>
            <p className="text-gray-500">No actual reviews available for this product yet.</p>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const { data: product, isLoading, isError, error } = useProductByIdQuery(id);
  const { data: filterOptions } = useFilterOptionsQuery();

  const { data: wishlist, isLoading: isWishlistLoading } = useWishlistQuery(isAuthenticated);
  const { mutate: addToWishlist, isPending: isAddingToWishlist } = useAddToWishlistMutation();
  const { mutate: removeFromWishlist, isPending: isRemovingFromWishlist } = useRemoveFromWishlistMutation();

  const isInWishlist = useMemo(() => {
    return !!(product && wishlist?.includes(product._id));
  }, [product, wishlist]);

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to save items to your wishlist.");
      navigate("/auth/login", { state: { from: location }, replace: true });
      return;
    }
    if (product) {
      if (isInWishlist) {
        removeFromWishlist([product._id]);
      } else {
        addToWishlist([product._id]);
      }
    }
  };

  const filterIdToNameMap = useMemo(() => {
    if (!filterOptions) return new Map<string, string>();
    const map = new Map<string, string>();
    Object.values(filterOptions).forEach((category) => {
      if (Array.isArray(category)) {
        category.forEach((option) => {
          map.set(option.filter_ID, option.name);
        });
      }
    });
    return map;
  }, [filterOptions]);

  if (isLoading || (isAuthenticated && isWishlistLoading)) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LoaderCircle className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
        <p className="mb-6 text-gray-500">{error?.message || "The product you're looking for doesn't exist."}</p>
        <Button variant="outline" asChild>
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Store
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <ProductImageGallery images={product.main_images_detail} name={product.productName_detail} autoSlide={false} />
        <div className="space-y-6">
          <ProductHeader
            product={product}
            onToggleWishlist={handleToggleWishlist}
            isAddingToWishlist={isAddingToWishlist}
            isRemovingFromWishlist={isRemovingFromWishlist}
            isInWishlist={isInWishlist}
          />
          <ProductPrice product={product} />
          <Separator />
          <ProductStockAndActions product={product} filterIdToNameMap={filterIdToNameMap} />
          <Separator />
          <ProductShippingAndReturns />
        </div>
      </div>
      <ProductTabs product={product} />
    </div>
  );
};

export default ProductDetailPage;
