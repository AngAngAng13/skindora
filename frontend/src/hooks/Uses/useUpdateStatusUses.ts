import { useCallback, useState } from "react";

import { updateStatusFilterUses } from "@/api/uses";

export interface PayloadProps {
  state: string;
}
export interface useUpdateStatusSkinTypeProps {
  id: string;
  payload: {
    state: string;
  };
}
export const useUpdateStatusFilterUses = (params: useUpdateStatusSkinTypeProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const updateStateFilterUses = useCallback(async () => {
    try {
      console.log(params.id);
      const response = await updateStatusFilterUses({ id: params.id }, params.payload);
      console.log(response);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    updateStateFilterUses,
    setLoading,
  };
};
