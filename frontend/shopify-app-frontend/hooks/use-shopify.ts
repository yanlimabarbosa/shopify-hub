import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

type ShopifyAuthResponse = {
  oauthUrl: string;
};

export function useShopifyAuth() {
  return useMutation({
    mutationFn: async (shop: string) => {
      const response = await apiClient.get<ShopifyAuthResponse>("/shopify/auth", {
        params: { shop },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (globalThis.window !== undefined) {
        globalThis.window.location.href = data.oauthUrl;
      }
    },
  });
}
