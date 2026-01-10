import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ProductsResponse } from "@/lib/types";

type ListProductsParams = {
  limit?: number;
  cursor?: string;
  shop?: string;
};

export function useListProducts(params?: ListProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await apiClient.get<ProductsResponse>("/products", {
        params,
      });
      return response.data;
    },
  });
}
