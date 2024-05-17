import prisma from '@/prisma';
import { AdminEventTransactionQuery } from '@/types/admin.type';
import {
  PaymentStatus,
  StatusResponse,
  TotalSaleResponse,
  TransactionCheckout,
} from '@/types/transaction.type';
import { Prisma, Transaction } from '@prisma/client';

export class TransactionRepository {
  static async getEventWaiting(id: number, data: TransactionCheckout) {
    const response = await prisma.transaction.findMany({
      where: {
        paymentStatus: PaymentStatus.WAITING,
        userId: id,
      },
      include: {
        event: {
          include: {
            category: true,
            location: true,
          },
        },
      },
    });
    // Group events by userId
    const groupedEvents: Record<number, Transaction[]> = {};
    response.forEach((transaction) => {
      if (!groupedEvents[transaction.userId]) {
        groupedEvents[transaction.userId] = [];
      }
      groupedEvents[transaction.userId].push(transaction);
    });
    // Rename the key "1" to "eventsWaiting"
    const result = {
      eventsWaiting: groupedEvents['1'],
    };
    return result;
  }

  static async getEventSuccess(id: number, data: TransactionCheckout) {
    const today = new Date().toISOString();
    const response = await prisma.transaction.findMany({
      where: {
        paymentStatus: PaymentStatus.SUCCESS,
        userId: id,
        event: {
          endDate: {
            gte: today,
          },
        },
      },
      include: {
        event: {
          include: {
            category: true,
            location: true,
          },
        },
      },
    });
    // Group events by userId
    const groupedEvents: Record<number, Transaction[]> = {};
    response.forEach((transaction) => {
      if (!groupedEvents[transaction.userId]) {
        groupedEvents[transaction.userId] = [];
      }
      groupedEvents[transaction.userId].push(transaction);
    });
    // Rename the key "1" to "eventsWaiting"
    const result = {
      eventsSuccess: groupedEvents['1'],
    };
    return result;
  }

  static async getEventSuccessByDate(id: number) {
    const today = new Date().toISOString();
    const response = await prisma.transaction.findMany({
      where: {
        paymentStatus: PaymentStatus.SUCCESS,
        userId: id,
        event: {
          endDate: {
            lt: today,
          },
        },
      },
      include: {
        event: {
          include: {
            category: true,
            location: true,
            feedbacks: true,
          },
        },
      },
    });

    // Group events by userId
    const groupedEvents: Record<number, Transaction[]> = {};
    response.forEach((transaction) => {
      if (!groupedEvents[transaction.userId]) {
        groupedEvents[transaction.userId] = [];
      }
      groupedEvents[transaction.userId].push(transaction);
    });
    // Rename the key "1" to "eventsWaiting"
    const result = {
      eventsSuccess: groupedEvents['1'],
    };
    return result;
  }

  static async getEventTransactions(
    id: number,
    query: AdminEventTransactionQuery,
  ) {
    return await prisma.transaction.findMany({
      where: { event: { user: { id: id } } },
      include: {
        user: { select: { username: true } },
        event: { select: { name: true } },
        voucher: { select: { name: true } },
      },
      skip: (Number(query.page) - 1) * Number(query.limit),
      take: Number(query.limit),
      orderBy: { [query.sort_by!]: query.order_by },
    });
  }

  static async getAllEventTransactions(id: number) {
    return await prisma.transaction.findMany({
      where: { event: { user: { id: id } } },
    });
  }

  static async getTotalSalesGroupByUpdatedAt(
    id: number,
    filter: { gte: Date | string; lte: Date | string },
  ): Promise<TotalSaleResponse[]> {
    const query = Prisma.sql`
    SELECT DATE(transactions.updatedAt) as date,
      SUM(CASE WHEN transactions.discountedAmount IS NULL THEN transactions.originalAmount ELSE transactions.discountedAmount END) as revenue
    FROM transactions
    JOIN events ON events.id = transactions.eventId
    WHERE events.userId = ${id}
      AND transactions.paymentStatus = 'success'
      AND transactions.updatedAt BETWEEN ${filter.gte} AND ${filter.lte}
    GROUP BY date
    ORDER BY date ASC
    ;`;

    return await prisma.$queryRaw(query);
  }

  static async getTransactionStatusByUpdatedAt(
    id: number,
    filter: { gte: Date | string; lte: Date | string },
  ): Promise<StatusResponse[]> {
    const query = Prisma.sql`
    SELECT
      DATE(transactions.updatedAt) as date,
      SUM(CASE WHEN transactions.paymentStatus = 'waiting' THEN transactions.quantity ELSE 0 END) as waiting,
      SUM(CASE WHEN transactions.paymentStatus = 'paid' THEN transactions.quantity ELSE 0 END) as paid,
      SUM(CASE WHEN transactions.paymentStatus = 'success' THEN transactions.quantity ELSE 0 END) as success,
      SUM(CASE WHEN transactions.paymentStatus = 'failed' THEN transactions.quantity ELSE 0 END) as failed
    FROM transactions
    JOIN events ON events.id = transactions.eventId
    WHERE events.userId = ${id}
      AND transactions.updatedAt BETWEEN ${filter.gte} AND ${filter.lte}
    GROUP BY date
    ORDER BY date ASC
    ;`;

    return await prisma.$queryRaw(query);
  }

  static async getTransactionHasUser(transactionId: number) {
    return await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { event: { include: { user: true } } },
    });
  }

  static async updateTransactionStatus(
    transactionId: number,
    status: PaymentStatus,
  ) {
    return await prisma.transaction.update({
      where: { id: transactionId },
      data: { paymentStatus: status },
    });
  }

  static async checkoutUser(transactionId: number, file: Express.Multer.File) {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentProof: `/assets/events/${file}`,
      },
    });
  }
}
