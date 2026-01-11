"use client";

import { useState } from "react";
import { useSyncProducts, useSyncOrders } from "@/hooks/use-sync";
import { useRequireAdmin } from "@/hooks/use-require-admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StyledInput } from "@/components/styled-input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Package, ShoppingCart, Loader2 } from "lucide-react";

export default function SyncPage() {
  const isAdmin = useRequireAdmin();
  const [shop, setShop] = useState("");
  const syncProducts = useSyncProducts();
  const syncOrders = useSyncOrders();

  const handleSyncProducts = () => {
    syncProducts.mutate(shop || undefined);
  };

  const handleSyncOrders = () => {
    syncOrders.mutate(shop || undefined);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Sincronizar</h1>
      <Card>
        <CardHeader>
          <CardTitle>Sincronizar Dados do Shopify</CardTitle>
          <CardDescription>
            Sincronize manualmente produtos e pedidos das suas lojas Shopify conectadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="shop">Domínio da Loja (Opcional)</Label>
            <StyledInput
              id="shop"
              type="text"
              placeholder="Deixe vazio para sincronizar todas as lojas"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Ações de Sincronização
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-3 p-4 rounded-lg border border-[#1d1d1d] bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-md bg-secondary border border-[#202020]">
                    <Package className="h-4 w-4" />
                  </div>
                  <h4 className="font-semibold">Sincronizar Produtos</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sincronize o catálogo de produtos da sua loja Shopify
                </p>
                <Button
                  onClick={handleSyncProducts}
                  disabled={syncProducts.isPending}
                  className="w-full"
                >
                  {syncProducts.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    "Sincronizar Produtos"
                  )}
                </Button>
              </div>

              <div className="flex flex-col gap-3 p-4 rounded-lg border border-[#1d1d1d] bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-md bg-secondary">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <h4 className="font-semibold">Sincronizar Pedidos</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sincronize o histórico de pedidos da sua loja Shopify
                </p>
                <Button
                  onClick={handleSyncOrders}
                  disabled={syncOrders.isPending}
                  className="w-full"
                >
                  {syncOrders.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    "Sincronizar Pedidos"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
