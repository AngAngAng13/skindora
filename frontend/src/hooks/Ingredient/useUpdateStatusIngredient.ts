import { useCallback, useState } from "react";

import { updateStatusFilterIngredient } from "@/api/ingredient";

export interface PayloadProps {
  state: string;
}
export interface useUpdateStatusFilterProps {
  id: string;
  payload: {
    state: string;
  };
}
export const useUpdateStatusIngredient = (params: useUpdateStatusFilterProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateStateIngredient = useCallback(async () => {
    try {
      console.log(params.id);
      const response = await updateStatusFilterIngredient({ id: params.id }, params.payload);
      console.log(response);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    updateStateIngredient,
    setLoading,
  };
};
