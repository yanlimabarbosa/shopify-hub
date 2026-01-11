"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type DataTablePaginationProps = {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  startItem: number;
  endItem: number;
  totalItems: number;
};

export function DataTablePagination({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  startItem,
  endItem,
  totalItems,
}: DataTablePaginationProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4 px-4 sm:px-0">
      <div className="text-sm text-muted-foreground">
        {totalItems > 0 ? (
          <>Mostrando {startItem}-{endItem} de {totalItems}</>
        ) : (
          <>Nenhum item</>
        )}
      </div>
      <Pagination className="w-auto !justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPrevious();
              }}
              className={!canGoPrevious ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNext();
              }}
              className={!canGoNext ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
