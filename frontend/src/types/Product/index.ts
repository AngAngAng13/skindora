export interface ProductSummary {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}
export interface ProductDetail extends ProductSummary {
  description: {
    plainText: string;
    rawHtml: string;
  };
  ingredients: {
    plainText: string;
    rawHtml: string;
  };
  images: string[]; 
  stockQuantity: number;
}

export interface PaginatedProductsResponse {
  data: ProductSummary[];
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
}