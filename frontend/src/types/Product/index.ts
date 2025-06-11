// A summary of a product, used for lists and cards
export interface ProductSummary {
  _id: string;
  name_on_list: string;
  price_on_list: string; // The backend sends this as a string, we can parse it later
  image_on_list: string;
  // Add any other fields you might show in a list view
}

// The full product details
export interface ProductDetail extends ProductSummary {
  description_detail: {
    plainText: string;
    rawHtml: string;
  };
  ingredients_detail: {
    plainText: string;
    rawHtml: string;
  };
  main_images_detail: string[]; 
  quantity: number;
  // Add all other detailed fields from your backend schema
}

// The exact shape of the paginated API response from your helper
export interface PaginatedProductsResponse {
  data: ProductSummary[];
  pagination: {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  }
}