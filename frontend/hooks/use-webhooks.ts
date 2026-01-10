import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { WebhooksResponse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useRegisterWebhooks() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (shop?: string) => {
      const response = await apiClient.post<WebhooksResponse>(
        "/webhooks/register",
        { shop }
      );
      return response.data;
    },
    onSuccess: (data) => {
      const successCount = data.webhooks.filter(
        (w) => w.status === "created" || w.status === "exists"
      ).length;
      const errorCount = data.webhooks.filter((w) => w.status === "error").length;

      if (errorCount > 0) {
        toast({
          title: "Sucesso Parcial",
          description: `${successCount} webhooks registrados, ${errorCount} falharam`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: `${successCount} webhooks registrados com sucesso`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao registrar webhooks",
        variant: "destructive",
      });
    },
  });
}
