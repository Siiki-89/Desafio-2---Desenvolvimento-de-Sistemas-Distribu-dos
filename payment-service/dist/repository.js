"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPaymentRepository = void 0;
class InMemoryPaymentRepository {
    items = new Map();
    async create(input) {
        const now = new Date().toISOString();
        const payment = { ...input, status: 'PENDING', createdAt: now, updatedAt: now };
        this.items.set(payment.id, payment);
        return payment;
    }
    async findById(id) {
        return this.items.get(id) ?? null;
    }
    async markSuccess(id) {
        const payment = this.items.get(id);
        if (!payment)
            return null;
        payment.status = 'SUCCESS';
        payment.updatedAt = new Date().toISOString();
        return payment;
    }
}
exports.InMemoryPaymentRepository = InMemoryPaymentRepository;
//# sourceMappingURL=repository.js.map