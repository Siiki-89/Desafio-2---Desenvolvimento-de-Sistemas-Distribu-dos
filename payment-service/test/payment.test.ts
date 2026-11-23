import { describe, expect, it } from 'vitest';
import { MemoryPublisher } from '../src/broker';
import { InMemoryPaymentRepository } from '../src/repository';
import { createPaymentServer } from '../src/server';

describe('payment service', () => {
  it('rejects invalid payment input without publishing', async () => {
    const publisher = new MemoryPublisher();
    const app = createPaymentServer({ repository: new InMemoryPaymentRepository(), publisher });
    const response = await app.inject({ method: 'POST', url: '/payments', payload: { customerEmail: 'invalid', amount: 0 } });
    expect(response.statusCode).toBe(400);
    expect(publisher.events).toHaveLength(0);
    await app.close();
  });

  it('creates a pending payment and later publishes its confirmation', async () => {
    const repository = new InMemoryPaymentRepository();
    const publisher = new MemoryPublisher();
    const app = createPaymentServer({ repository, publisher, confirmationDelayMs: 10 });
    const response = await app.inject({ method: 'POST', url: '/payments', payload: { customerEmail: 'cliente@example.com', amount: 99.9 } });
    expect(response.statusCode).toBe(202);
    const payment = response.json();
    expect(payment.status).toBe('PENDING');
    expect(publisher.events[0].type).toBe('payment.requested');
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect((await repository.findById(payment.id))?.status).toBe('SUCCESS');
    expect(publisher.events[1].type).toBe('payment.confirmed');
    await app.close();
  });

  it('returns 404 for unknown payments', async () => {
    const app = createPaymentServer({ repository: new InMemoryPaymentRepository(), publisher: new MemoryPublisher() });
    const response = await app.inject({ method: 'GET', url: '/payments/unknown' });
    expect(response.statusCode).toBe(404);
    await app.close();
  });
});
