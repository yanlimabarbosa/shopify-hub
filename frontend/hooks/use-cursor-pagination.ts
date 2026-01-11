import { useState, useCallback } from "react";

export function useCursorPagination(limit: number = 5) {
  const [cursor, setCursor] = useState<string | undefined>();
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);

  const handleNext = useCallback((nextCursor?: string) => {
    if (nextCursor) {
      if (cursor) {
        setCursorHistory((prev) => [...prev, cursor]);
      }
      setCursor(nextCursor);
    }
  }, [cursor]);

  const handlePrevious = useCallback(() => {
    if (cursorHistory.length > 0) {
      const previousCursor = cursorHistory[cursorHistory.length - 1];
      setCursorHistory((prev) => prev.slice(0, -1));
      setCursor(previousCursor);
    } else {
      setCursor(undefined);
      setCursorHistory([]);
    }
  }, [cursorHistory]);

  const reset = useCallback(() => {
    setCursor(undefined);
    setCursorHistory([]);
  }, []);

  const canGoPrevious: boolean = cursorHistory.length > 0 || Boolean(cursor);
  
  const getItemRange = useCallback((currentItemsCount: number, totalCount: number) => {
    const startItem = cursorHistory.length * limit + 1;
    const endItem = cursorHistory.length * limit + currentItemsCount;
    return { startItem, endItem, totalItems: totalCount };
  }, [cursorHistory.length, limit]);

  return {
    cursor,
    cursorHistory,
    handleNext,
    handlePrevious,
    reset,
    canGoPrevious,
    getItemRange,
  };
}
