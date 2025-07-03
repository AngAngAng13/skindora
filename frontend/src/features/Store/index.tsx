
import { Frown, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PaginationDemo } from "@/features/Admin/components/Pagination";
import { useAllProductsQuery } from "@/hooks/queries/useAllProductsQuery";
import { useDebounce } from "@/hooks/useDebounce";
import type { Product } from "@/types";

import { AccordionFilter } from "./components/AccordionFilter";
import { MobileMenu } from "./components/MobileMenu";
import { ProductBanner } from "./components/ProductBanner";
import { ProductList } from "./components/ProductList";
import { StoreFooter } from "./components/StoreFooter";

const StoreFront = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedFilters = useDebounce(selectedFilters, 500);

  const { data: paginatedData, isLoading, isError } = useAllProductsQuery(currentPage, 12, debouncedFilters);
  const products: Product[] = paginatedData?.data ?? [];
  const paginationInfo = paginatedData?.pagination;

  const handleFilterChange = (filterType: string, filterValue: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterType] || [];
      const isSelected = currentValues.includes(filterValue);
      const newValues = isSelected
        ? currentValues.filter((val) => val !== filterValue)
        : [...currentValues, filterValue];

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

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCardClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        selectedCategory={"Tất cả"}
        setSelectedCategory={() => {}}
        categories={[]}
        productTypes={[]}
        toggleProductType={() => {}}
      />

      <main className="container mx-auto max-w-[1440px] px-4 py-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full flex-shrink-0 lg:w-72">
            <AccordionFilter
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
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
                  addToCart={addToCart}
                  handleCardClick={handleCardClick}
                  clearFilters={handleClearFilters}
                  selectedCategory="Tất cả sản phẩm"
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
