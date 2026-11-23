"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryNotificationRepository = void 0;
class InMemoryNotificationRepository {
    items = new Map();
    async createFromEvent(event) {
        if (this.items.has(event.eventId))
            return null;
        const notification = { id: event.eventId, eventId: event.eventId, paymentId: event.paymentId, recipient: event.customerEmail, message: event.type === 'payment.requested' ? 'Recebemos sua solicitação de pagamento.' : 'Seu pagamento foi confirmado com sucesso.', createdAt: new Date().toISOString() };
        this.items.set(event.eventId, notification);
        return notification;
    }
    async list() { return [...this.items.values()]; }
}
exports.InMemoryNotificationRepository = InMemoryNotificationRepository;
//# sourceMappingURL=repository.js.map