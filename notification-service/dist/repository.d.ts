import type { PaymentEvent } from '@compre-facil/contracts/events';
export type Notification = {
    id: string;
    eventId: string;
    paymentId: string;
    recipient: string;
    message: string;
    createdAt: string;
};
export interface NotificationRepository {
    createFromEvent(event: PaymentEvent): Promise<Notification | null>;
    list(): Promise<Notification[]>;
}
export declare class InMemoryNotificationRepository implements NotificationRepository {
    private readonly items;
    createFromEvent(event: PaymentEvent): Promise<Notification | null>;
    list(): Promise<Notification[]>;
}
