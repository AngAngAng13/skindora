import { useCallback, useState } from "react";

import { updateStatusBrand } from "@/api/brand";

export interface PayloadProps {
  state: string;
}
export interface useUpdateStatusBrandProps {
  id: string;
  payload: {
    state: string;
  };
}
export const useUpdateStatusBrand = (params: useUpdateStatusBrandProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateStateBrand = useCallback(async () => {
    try {
      console.log(params.id);
      const response = await updateStatusBrand({ id: params.id }, params.payload);
      console.log(response);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    updateStateBrand,
    setLoading,
  };
};
