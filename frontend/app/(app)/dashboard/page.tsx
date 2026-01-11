"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { useRequireAdmin } from "@/hooks/use-require-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const isAdmin = useRequireAdmin({ redirectTo: "/products" });
  const { data, isLoading, error } = useDashboard();

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Painel</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Painel</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Falha ao carregar dados do painel</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Painel</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalProducts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalOrders || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos (24h)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.ordersLast24h || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
