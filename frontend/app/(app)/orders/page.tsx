"use client";

import { useState } from "react";
import { useListOrders } from "@/hooks/use-orders";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { formatDate } from "@/lib/utils/date";
import { PageHeader } from "@/components/page-header";
import { ShopFilter } from "@/components/shop-filter";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function OrdersPage() {
  const [limit] = useState(5);
  const [shopFilter, setShopFilter] = useState<string | undefined>();

  const pagination = useCursorPagination(limit);
  const { data, isLoading, error } = useListOrders({
    limit,
    cursor: pagination.cursor,
    shop: shopFilter,
  });

  const handleShopChange = (value: string) => {
    setShopFilter(value === "all" ? undefined : value);
    pagination.reset();
  };

  const handleNext = () => {
    if (data?.nextCursor) {
      pagination.handleNext(data.nextCursor);
    }
  };

  const canGoNext = data?.hasMore || false;
  const { startItem, endItem, totalItems } = pagination.getItemRange(
    data?.orders.length || 0,
    data?.count || 0
  );

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
      <PageHeader title="Pedidos">
        <ShopFilter
          value={shopFilter || "all"}
          onValueChange={handleShopChange}
          className="w-full sm:w-64"
        />
      </PageHeader>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message="Falha ao carregar pedidos" />
      ) : (
        <>
          <Card className="border shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>Pedidos ({data?.count || 0})</CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4 sm:px-6">Nome do Pedido</TableHead>
                      <TableHead className="px-4 sm:px-6">Preço Total</TableHead>
                      <TableHead className="px-4 sm:px-6">Status</TableHead>
                      <TableHead className="px-4 sm:px-6">Loja</TableHead>
                      <TableHead className="px-4 sm:px-6">Criado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.orders.length === 0 ? (
                      <EmptyState message="Nenhum pedido encontrado" colSpan={5} />
                    ) : (
                      data?.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium px-4 sm:px-6">
                            {order.name}
                          </TableCell>
                          <TableCell className="px-4 sm:px-6">
                            {order.totalPrice} {order.currency}
                          </TableCell>
                          <TableCell className="px-4 sm:px-6">
                            <Badge variant="outline">
                              {order.financialStatus || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground px-4 sm:px-6">
                            {order.shopId}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground px-4 sm:px-6">
                            {formatDate(order.createdAtShopify || order.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <DataTablePagination
            canGoPrevious={pagination.canGoPrevious}
            canGoNext={canGoNext}
            onPrevious={pagination.handlePrevious}
            onNext={handleNext}
            startItem={startItem}
            endItem={endItem}
            totalItems={totalItems}
          />
        </>
      )}
    </div>
  );
}
