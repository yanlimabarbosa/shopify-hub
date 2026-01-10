"use client";

import { useState } from "react";
import { useListProducts } from "@/hooks/use-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductsPage() {
  const [limit] = useState(5);
  const [cursor, setCursor] = useState<string | undefined>();
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [shop, setShop] = useState<string>("");
  const [shopFilter, setShopFilter] = useState<string | undefined>();

  const { data, isLoading, error } = useListProducts({
    limit,
    cursor,
    shop: shopFilter,
  });

  const handleNext = () => {
    if (data?.nextCursor) {
      if (cursor) {
        setCursorHistory([...cursorHistory, cursor]);
      }
      setCursor(data.nextCursor);
    }
  };

  const handlePrevious = () => {
    if (cursorHistory.length > 0) {
      const previousCursor = cursorHistory[cursorHistory.length - 1];
      setCursorHistory(cursorHistory.slice(0, -1));
      setCursor(previousCursor);
    } else {
      setCursor(undefined);
      setCursorHistory([]);
    }
  };

  const canGoPrevious = cursorHistory.length > 0 || cursor;
  const canGoNext = data?.hasMore || false;

  // Calculate pagination info
  const currentPage = cursorHistory.length + 1;
  const totalPages = data?.count ? Math.ceil(data.count / limit) : 1;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page === currentPage) return;
    
    if (page < currentPage) {
      // Go back
      const stepsBack = currentPage - page;
      if (stepsBack <= cursorHistory.length) {
        const newHistory = cursorHistory.slice(0, -stepsBack);
        const newCursor = newHistory.length > 0 ? newHistory[newHistory.length - 1] : undefined;
        setCursorHistory(newHistory);
        setCursor(newCursor);
      } else {
        // Go to first page
        setCursor(undefined);
        setCursorHistory([]);
      }
    } else {
      // Go forward - we can only go forward sequentially with cursor-based pagination
      // So we'll just go to next if it's the immediate next page
      if (page === currentPage + 1) {
        handleNext();
      }
    }
  };

  const handleShopFilter = () => {
    setShopFilter(shop || undefined);
    setCursor(undefined);
    setCursorHistory([]);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "-";
    
    // Handle ISO date strings and other formats
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      // Try parsing as timestamp if it's a number string
      const timestamp = Number(dateString);
      if (!isNaN(timestamp) && timestamp > 0) {
        const dateFromTimestamp = new Date(timestamp);
        if (!isNaN(dateFromTimestamp.getTime())) {
          return dateFromTimestamp.toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
      }
      return "-";
    }
    
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Filtrar por domínio da loja..."
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={handleShopFilter} size="sm" className="w-full sm:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="border shadow-sm">
          <CardContent className="pt-6 px-4 sm:px-6">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border shadow-sm">
          <CardContent className="pt-6 px-4 sm:px-6">
            <p className="text-destructive">Falha ao carregar produtos</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>
                Produtos ({data?.count || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4 sm:px-6">Título</TableHead>
                      <TableHead className="px-4 sm:px-6">Fornecedor</TableHead>
                      <TableHead className="px-4 sm:px-6">Status</TableHead>
                      <TableHead className="px-4 sm:px-6">Loja</TableHead>
                      <TableHead className="px-4 sm:px-6">Criado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center px-4 sm:px-6 py-8">
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium px-4 sm:px-6">
                            {product.title}
                          </TableCell>
                          <TableCell className="px-4 sm:px-6">{product.vendor || "-"}</TableCell>
                          <TableCell className="px-4 sm:px-6">
                            <Badge variant="outline">{product.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground px-4 sm:px-6">
                            {product.shopId}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground px-4 sm:px-6">
                            {formatDate(product.createdAtShopify || product.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end px-4 sm:px-0">
            <Pagination className="w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePrevious();
                    }}
                    className={!canGoPrevious ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageClick(page);
                        }}
                        isActive={page === currentPage}
                        className={
                          page > currentPage + 1 || page < currentPage - 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNext();
                    }}
                    className={!canGoNext ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}
