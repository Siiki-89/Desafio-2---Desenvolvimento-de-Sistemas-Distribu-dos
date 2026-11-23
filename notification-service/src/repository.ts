import type { PaymentEvent } from '@compre-facil/contracts/events';

export type Notification = { id: string; eventId: string; paymentId: string; recipient: string; message: string; createdAt: string };
export interface NotificationRepository { createFromEvent(event: PaymentEvent): Promise<Notification | null>; list(): Promise<Notification[]>; }

export class InMemoryNotificationRepository implements NotificationRepository {
  private readonly items = new Map<string, Notification>();
  async createFromEvent(event: PaymentEvent): Promise<Notification | null> {
    if (this.items.has(event.eventId)) return null;
    const notification: Notification = { id: event.eventId, eventId: event.eventId, paymentId: event.paymentId, recipient: event.customerEmail, message: event.type === 'payment.requested' ? 'Recebemos sua solicitação de pagamento.' : 'Seu pagamento foi confirmado com sucesso.', createdAt: new Date().toISOString() };
    this.items.set(event.eventId, notification);
    return notification;
  }
  async list(): Promise<Notification[]> { return [...this.items.values()]; }
}
