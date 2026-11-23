import type { PaymentConfirmedEvent, PaymentRequestedEvent } from '@compre-facil/contracts/events';
export type EventPublisher = {
    publish(event: PaymentRequestedEvent | PaymentConfirmedEvent): Promise<void>;
};
export declare class MemoryPublisher implements EventPublisher {
    readonly events: Array<PaymentRequestedEvent | PaymentConfirmedEvent>;
    publish(event: PaymentRequestedEvent | PaymentConfirmedEvent): Promise<void>;
}
