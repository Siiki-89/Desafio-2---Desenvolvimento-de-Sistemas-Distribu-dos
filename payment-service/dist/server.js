"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentServer = createPaymentServer;
const node_crypto_1 = require("node:crypto");
const fastify_1 = __importDefault(require("fastify"));
const events_1 = require("@compre-facil/contracts/events");
function createPaymentServer({ repository, publisher, confirmationDelayMs = 0 }) {
    const app = (0, fastify_1.default)({ logger: false });
    app.post('/payments', async (request, reply) => {
        const { customerEmail, amount } = request.body ?? {};
        if (!customerEmail || !customerEmail.includes('@') || typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
            return reply.code(400).send({ error: 'customerEmail válido e amount maior que zero são obrigatórios' });
        }
        const payment = await repository.create({ id: (0, node_crypto_1.randomUUID)(), customerEmail, amount });
        const requested = {
            eventId: (0, node_crypto_1.randomUUID)(), type: 'payment.requested', paymentId: payment.id,
            customerEmail: payment.customerEmail, amount: payment.amount, status: events_1.PaymentStatus.Pending, occurredAt: new Date().toISOString(),
        };
        await publisher.publish(requested);
        setTimeout(async () => {
            const confirmedPayment = await repository.markSuccess(payment.id);
            if (!confirmedPayment)
                return;
            const confirmed = {
                eventId: (0, node_crypto_1.randomUUID)(), type: 'payment.confirmed', paymentId: confirmedPayment.id,
                customerEmail: confirmedPayment.customerEmail, amount: confirmedPayment.amount, status: events_1.PaymentStatus.Success, occurredAt: new Date().toISOString(),
            };
            await publisher.publish(confirmed);
        }, confirmationDelayMs).unref?.();
        return reply.code(202).send(payment);
    });
    app.get('/payments/:id', async (request, reply) => {
        const payment = await repository.findById(request.params.id);
        return payment ? reply.send(payment) : reply.code(404).send({ error: 'Pagamento não encontrado' });
    });
    app.get('/health', async () => ({ status: 'ok', service: 'payment' }));
    return app;
}
//# sourceMappingURL=server.js.map