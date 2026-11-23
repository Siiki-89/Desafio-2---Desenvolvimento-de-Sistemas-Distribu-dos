import { describe, expect, it } from 'vitest';
import { PaymentStatus, type PaymentRequestedEvent } from '@compre-facil/contracts/events';

describe('shared event contracts', () => {
  it('exposes the statuses required by the challenge', () => {
    expect(PaymentStatus.Pending).toBe('PENDING');
    expect(PaymentStatus.Success).toBe('SUCCESS');
  });

  it('models a payment requested event', () => {
    const event: PaymentRequestedEvent = {
      eventId: 'event-1',
      type: 'payment.requested',
      paymentId: 'payment-1',
      customerEmail: 'cliente@example.com',
      amount: 42.5,
      status: PaymentStatus.Pending,
      occurredAt: new Date().toISOString(),
    };

    expect(event.type).toBe('payment.requested');
    expect(event.status).toBe('PENDING');
  });
});
