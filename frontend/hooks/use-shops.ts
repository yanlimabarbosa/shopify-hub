import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export type Shop = {
  id: string;
  shopDomain: string;
  installedAt: string;
};

export function useShops() {
  return useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const response = await apiClient.get<Shop[]>("/shopify/shops");
      return response.data;
    },
  });
}
