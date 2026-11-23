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
    create(input: {
        id: string;
        customerEmail: string;
        amount: number;
    }): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    markSuccess(id: string): Promise<Payment | null>;
}
export declare class InMemoryPaymentRepository implements PaymentRepository {
    private readonly items;
    create(input: {
        id: string;
        customerEmail: string;
        amount: number;
    }): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    markSuccess(id: string): Promise<Payment | null>;
}
