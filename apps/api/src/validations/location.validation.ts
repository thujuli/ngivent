import { z } from 'zod';

export class LocationValidation {
  static QUERY = z.object({
    name: z.string().optional(),
    page: z.coerce
      .number({ invalid_type_error: 'Page must be a Number!' })
      .optional(),
    limit: z.coerce
      .number({ invalid_type_error: 'Limit must be a Number!' })
      .optional(),
    sort_by: z
      .enum(['name'], { message: "Sort only allow: 'name'!" })
      .optional(),
    order_by: z
      .enum(['asc', 'desc'], { message: "Order must be 'asc' or 'desc'" })
      .optional(),
  });
}
