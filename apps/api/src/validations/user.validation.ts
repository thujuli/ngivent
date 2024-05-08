import { z } from 'zod';

const EventSortEnum = [
  'name',
  'price',
  'availableSeats',
  'startDate',
  'endDate',
  'createdAt',
] as const;

export class UserValidation {
  static EVENT_QUERY = z.object({
    name: z.string().optional(),
    page: z.coerce
      .number({ invalid_type_error: 'Page must be a Number!' })
      .optional(),
    limit: z.coerce
      .number({ invalid_type_error: 'Limit must be a Number!' })
      .optional(),
    sort_by: z
      .enum(EventSortEnum, {
        message: `Sort only allow: '${EventSortEnum.join(', ')}'`,
      })
      .optional(),
    order_by: z
      .enum(['asc', 'desc'], { message: "Order must be 'asc' or 'desc'" })
      .optional(),
  });
}
