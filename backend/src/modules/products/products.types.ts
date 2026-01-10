import { z } from "zod";

export const listProductsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  cursor: z.string().optional(),
  shop: z.string().optional(),
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
