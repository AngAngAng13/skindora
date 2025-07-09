import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface ProductListProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  onCardClick: (productId: string) => void;
  clearFilters: () => void;
  loadingProductId: string | null;
}

export function ProductList({ products, onAddToCart, onCardClick, clearFilters, loadingProductId }: ProductListProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">All Products</h2>
        <p className="text-sm text-gray-500">{products.length} products found</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              variant="default"
              onAddToCart={() => onAddToCart(product._id)}
              onCardClick={() => onCardClick(product._id)}
              isAddingToCart={loadingProductId === product._id}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">No products found for the selected filters.</p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </>
  );
}
