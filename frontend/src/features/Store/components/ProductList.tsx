import { Button } from "@/components/ui/button";
import { StoreProductCard } from "./StoreProductCard";
import type { Product } from "@/types";

interface ProductListProps {
  filteredProducts: Product[];
  selectedCategory: string;
  addToCart: (e: React.MouseEvent) => void;
  handleCardClick: (productId: string) => void;
  clearFilters: () => void;
}

export function ProductList({ 
  filteredProducts, 
  selectedCategory, 
  addToCart, 
  handleCardClick,
  clearFilters
}: ProductListProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{selectedCategory}</h2>
        <p className="text-sm text-gray-500">{filteredProducts.length} sản phẩm</p>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <StoreProductCard 
              key={product._id}
              product={product}
              onAddToCart={addToCart}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={clearFilters}
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </>
  );
}