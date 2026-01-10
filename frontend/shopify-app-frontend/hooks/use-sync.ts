import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { SyncResponse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useSyncProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (shop?: string) => {
      const response = await apiClient.post<SyncResponse>("/sync/products", {
        shop,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({
        title: "Sucesso",
        description: `${data.syncedCount} produtos sincronizados com sucesso`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao sincronizar produtos",
        variant: "destructive",
      });
    },
  });
}

export function useSyncOrders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (shop?: string) => {
      const response = await apiClient.post<SyncResponse>("/sync/orders", {
        shop,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({
        title: "Sucesso",
        description: `${data.syncedCount} pedidos sincronizados com sucesso`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao sincronizar pedidos",
        variant: "destructive",
      });
    },
  });
}
