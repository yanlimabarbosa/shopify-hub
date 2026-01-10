"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store/auth-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShopifyAuth } from "@/hooks/use-shopify";
import { useToast } from "@/hooks/use-toast";

const shopifyAuthSchema = z.object({
  shop: z.string().min(1, "Domínio da loja é obrigatório").refine(
    (val) => val.includes(".myshopify.com"),
    "Deve ser um domínio Shopify válido (ex: sua-loja.myshopify.com)"
  ),
});

type ShopifyAuthForm = z.infer<typeof shopifyAuthSchema>;

export default function ShopifyPage() {
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const shopifyAuth = useShopifyAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShopifyAuthForm>({
    resolver: zodResolver(shopifyAuthSchema),
  });

  const onSubmit = (data: ShopifyAuthForm) => {
    shopifyAuth.mutate(data.shop, {
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: error.response?.data?.message || "Falha ao iniciar OAuth",
          variant: "destructive",
        });
      },
    });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">OAuth Shopify</h1>
      <Card>
        <CardHeader>
          <CardTitle>Conectar Loja Shopify</CardTitle>
          <CardDescription>
            Conecte sua loja Shopify para sincronizar produtos e pedidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shop">Domínio da Loja</Label>
              <Input
                id="shop"
                type="text"
                placeholder="sua-loja.myshopify.com"
                {...register("shop")}
              />
              {errors.shop && (
                <p className="text-sm text-destructive">{errors.shop.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={shopifyAuth.isPending}>
              {shopifyAuth.isPending ? "Conectando..." : "Conectar Loja"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
