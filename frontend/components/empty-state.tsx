"use client";

import { TableCell, TableRow } from "@/components/ui/table";

type EmptyStateProps = {
  message: string;
  colSpan: number;
};

export function EmptyState({ message, colSpan }: EmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center px-4 sm:px-6 py-8">
        {message}
      </TableCell>
    </TableRow>
  );
}
