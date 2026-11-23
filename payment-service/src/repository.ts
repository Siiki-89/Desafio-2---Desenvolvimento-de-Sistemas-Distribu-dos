import type { PaymentStatus } from '@compre-facil/contracts/events';

export type Payment = {
  id: string;
  customerEmail: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};

export interface PaymentRepository {
  create(input: { id: string; customerEmail: string; amount: number }): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  markSuccess(id: string): Promise<Payment | null>;
}

export class InMemoryPaymentRepository implements PaymentRepository {
  private readonly items = new Map<string, Payment>();

  async create(input: { id: string; customerEmail: string; amount: number }): Promise<Payment> {
    const now = new Date().toISOString();
    const payment: Payment = { ...input, status: 'PENDING', createdAt: now, updatedAt: now };
    this.items.set(payment.id, payment);
    return payment;
  }

  async findById(id: string): Promise<Payment | null> {
    return this.items.get(id) ?? null;
  }

  async markSuccess(id: string): Promise<Payment | null> {
    const payment = this.items.get(id);
    if (!payment) return null;
    payment.status = 'SUCCESS';
    payment.updatedAt = new Date().toISOString();
    return payment;
  }
}
