import { Frown, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { PaginationDemo } from "@/features/Admin/components/Pagination";
import { useAddToCartMutation } from "@/hooks/mutations/useAddToCartMutation";
import { useAllProductsQuery } from "@/hooks/queries/useAllProductsQuery";
import { useFilterOptionsQuery } from "@/hooks/queries/useFilterOptionsQuery";
import { useDebounce } from "@/hooks/useDebounce";
import type { Product } from "@/types";

import { AccordionFilter } from "./components/AccordionFilter";
import { ProductBanner } from "./components/ProductBanner";
import { StoreFooter } from "./components/StoreFooter";

interface ProductListProps {
  filteredProducts: Product[];
  selectedCategory: string;
  addToCart: (productId: string) => void;
  isAddingToCart: boolean;
  handleCardClick: (productId: string) => void;
  clearFilters: () => void;
}

function ProductList({
  filteredProducts,
  selectedCategory,
  addToCart,
  isAddingToCart,
  handleCardClick,
  clearFilters,
}: ProductListProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{selectedCategory}</h2>
        <p className="text-sm text-gray-500">{filteredProducts.length} products found</p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              variant="default"
              onAddToCart={addToCart}
              onCardClick={handleCardClick}
              isAddingToCart={isAddingToCart}
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

const StoreFront = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const filters: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key !== "q" && key !== "page") {
        filters[key] = value.split(",");
      }
    }
    return filters;
  });

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const searchTerm = searchParams.get("q") || "";

  const debouncedFilters = useDebounce(selectedFilters, 500);
  const { data: filterData } = useFilterOptionsQuery();

  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useAllProductsQuery(currentPage, 12, debouncedFilters, searchTerm);

  const products: Product[] = paginatedData?.data ?? [];
  const paginationInfo = paginatedData?.pagination;

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCartMutation();
  const handleAddToCart = (productId: string) => {
    addToCart({ ProductID: productId, Quantity: 1 });
  };

  const handleCardClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const filterIdToNameMap = useMemo(() => {
    if (!filterData) return new Map<string, string>();
    const map = new Map<string, string>();
    Object.values(filterData).forEach((options) => {
      options.forEach((option) => map.set(option.filter_ID, option.name));
    });
    return map;
  }, [filterData]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (searchTerm) newSearchParams.set("q", searchTerm);

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        newSearchParams.set(key, values.join(","));
      }
    });

    if (currentPage > 1) newSearchParams.set("page", String(currentPage));

    setSearchParams(newSearchParams, { replace: true });
  }, [selectedFilters, currentPage, searchTerm, setSearchParams]);

  const handleFilterChange = (filterType: string, filterId: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(filterId)
        ? currentValues.filter((id) => id !== filterId)
        : [...currentValues, filterId];

      if (newValues.length === 0) {
        const { [filterType]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [filterType]: newValues };
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto max-w-[1440px] px-4 py-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full flex-shrink-0 lg:w-72">
            <AccordionFilter
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              filterIdToNameMap={filterIdToNameMap}
            />
          </aside>

          <div className="flex-1">
            <ProductBanner />

            {isLoading ? (
              <div className="flex h-96 items-center justify-center">
                <LoaderCircle className="text-primary h-12 w-12 animate-spin" />
              </div>
            ) : isError ? (
              <div className="text-destructive flex h-96 flex-col items-center justify-center">
                <Frown className="mb-2 h-12 w-12" />
                <p>Failed to load products.</p>
              </div>
            ) : (
              <>
                <ProductList
                  filteredProducts={products}
                  selectedCategory="Tất cả sản phẩm"
                  addToCart={handleAddToCart}
                  isAddingToCart={isAddingToCart}
                  handleCardClick={handleCardClick}
                  clearFilters={handleClearFilters}
                />
                <div className="mt-8 flex justify-center">
                  <PaginationDemo
                    totalPages={paginationInfo?.totalPages ?? 1}
                    currentPage={paginationInfo?.currentPage ?? 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default StoreFront;
