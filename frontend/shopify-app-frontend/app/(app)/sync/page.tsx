"use client";

import { useState, useEffect } from "react";
import { useSyncProducts, useSyncOrders } from "@/hooks/use-sync";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, ShoppingCart, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";

export default function SyncPage() {
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const [shop, setShop] = useState("");
  const syncProducts = useSyncProducts();
  const syncOrders = useSyncOrders();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, router]);

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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shop">Domínio da Loja (Opcional)</Label>
            <Input
              id="shop"
              type="text"
              placeholder="Deixe vazio para sincronizar todas as lojas"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Sincronizar Produtos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Sincronizar Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
