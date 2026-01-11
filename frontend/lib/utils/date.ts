export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    const timestamp = Number(dateString);
    if (!Number.isNaN(timestamp) && timestamp > 0) {
      const dateFromTimestamp = new Date(timestamp);
      if (!Number.isNaN(dateFromTimestamp.getTime())) {
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
}
