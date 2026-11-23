import type { PaymentConfirmedEvent, PaymentRequestedEvent } from '@compre-facil/contracts/events';

export type EventPublisher = {
  publish(event: PaymentRequestedEvent | PaymentConfirmedEvent): Promise<void>;
};

export class MemoryPublisher implements EventPublisher {
  readonly events: Array<PaymentRequestedEvent | PaymentConfirmedEvent> = [];
  async publish(event: PaymentRequestedEvent | PaymentConfirmedEvent): Promise<void> { this.events.push(event); }
}
