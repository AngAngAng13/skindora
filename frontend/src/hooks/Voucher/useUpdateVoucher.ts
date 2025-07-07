import { useCallback, useState } from "react";

import { updateVoucher } from "@/api/voucher";
import type { Voucher } from "@/types/voucher";

export const useUpdateVoucher = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const [voucherUpdate, setVoucherUpdate] = useState<Voucher>();
  const [status, setStatus] = useState<Number>(0);
  const updateVoucherByID = useCallback(async (payload: Voucher) => {
    try {
      const response = await updateVoucher({ voucherId: id }, payload);
      console.log(response);
      setStatus(response.status);
      console.log(response.status);
      setVoucherUpdate(response.data);
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      setVoucher(undefined);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  return {
    loading,
    status,
    voucherUpdate,
    updateVoucherByID,
  };
};
