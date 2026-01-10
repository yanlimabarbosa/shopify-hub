import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { OrdersResponse } from "@/lib/types";

type ListOrdersParams = {
  limit?: number;
  cursor?: string;
  shop?: string;
};

export function useListOrders(params?: ListOrdersParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const response = await apiClient.get<OrdersResponse>("/orders", {
        params,
      });
      return response.data;
    },
  });
}
