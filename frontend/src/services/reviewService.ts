import type { Result } from "neverthrow";

import { apiClient } from "@/lib/apiClient";
import type { ApiError } from "@/utils";
import type { ApiResponse } from "@/utils/axios/types";

export interface AddReviewPayload {
  rating: number;
  comment: string;
  images?: string[];
  videos?: string[];
}

export const reviewService = {
  addReview: (
    orderId: string,
    productId: string,
    payload: AddReviewPayload
  ): Promise<Result<ApiResponse<{ message: string }>, ApiError>> => {
    return apiClient.post(`/review/${orderId}/products/${productId}/review`, payload);
  },
};
