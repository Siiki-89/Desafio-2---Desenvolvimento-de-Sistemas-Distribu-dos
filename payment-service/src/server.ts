import { randomUUID } from 'node:crypto';
import Fastify, { type FastifyInstance } from 'fastify';
import { PaymentStatus, type PaymentConfirmedEvent, type PaymentRequestedEvent } from '@compre-facil/contracts/events';
import type { EventPublisher } from './broker';
import type { PaymentRepository } from './repository';

type Dependencies = { repository: PaymentRepository; publisher: EventPublisher; confirmationDelayMs?: number };

export function createPaymentServer({ repository, publisher, confirmationDelayMs = 0 }: Dependencies): FastifyInstance {
  const app = Fastify({ logger: false });

  app.post<{ Body: { customerEmail?: string; amount?: number } }>('/payments', async (request, reply) => {
    const { customerEmail, amount } = request.body ?? {};
    if (!customerEmail || !customerEmail.includes('@') || typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return reply.code(400).send({ error: 'customerEmail válido e amount maior que zero são obrigatórios' });
    }

    const payment = await repository.create({ id: randomUUID(), customerEmail, amount });
    const requested: PaymentRequestedEvent = {
      eventId: randomUUID(), type: 'payment.requested', paymentId: payment.id,
      customerEmail: payment.customerEmail, amount: payment.amount, status: PaymentStatus.Pending, occurredAt: new Date().toISOString(),
    };
    await publisher.publish(requested);

    setTimeout(async () => {
      const confirmedPayment = await repository.markSuccess(payment.id);
      if (!confirmedPayment) return;
      const confirmed: PaymentConfirmedEvent = {
        eventId: randomUUID(), type: 'payment.confirmed', paymentId: confirmedPayment.id,
        customerEmail: confirmedPayment.customerEmail, amount: confirmedPayment.amount, status: PaymentStatus.Success, occurredAt: new Date().toISOString(),
      };
      await publisher.publish(confirmed);
    }, confirmationDelayMs).unref?.();

    return reply.code(202).send(payment);
  });

  app.get<{ Params: { id: string } }>('/payments/:id', async (request, reply) => {
    const payment = await repository.findById(request.params.id);
    return payment ? reply.send(payment) : reply.code(404).send({ error: 'Pagamento não encontrado' });
  });

  app.get('/health', async () => ({ status: 'ok', service: 'payment' }));
  return app;
}
