import { describe, expect, it } from 'vitest';
import { InMemoryNotificationRepository } from '../src/repository';

const event = { eventId: 'event-1', type: 'payment.requested' as const, paymentId: 'payment-1', customerEmail: 'cliente@example.com', amount: 10, status: 'PENDING' as const, occurredAt: new Date().toISOString() };

describe('notification repository', () => {
  it('creates one notification for each event', async () => {
    const repository = new InMemoryNotificationRepository();
    expect(await repository.createFromEvent(event)).not.toBeNull();
    expect(await repository.createFromEvent(event)).toBeNull();
    expect((await repository.list())).toHaveLength(1);
  });

  it('writes the confirmation message for a confirmed payment', async () => {
    const repository = new InMemoryNotificationRepository();
    const result = await repository.createFromEvent({ ...event, eventId: 'event-2', type: 'payment.confirmed', status: 'SUCCESS' });
    expect(result?.message).toContain('confirmado');
  });
});
