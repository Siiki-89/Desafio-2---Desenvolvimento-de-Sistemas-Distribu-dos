import { type FastifyInstance } from 'fastify';
import type { EventPublisher } from './broker';
import type { PaymentRepository } from './repository';
type Dependencies = {
    repository: PaymentRepository;
    publisher: EventPublisher;
    confirmationDelayMs?: number;
};
export declare function createPaymentServer({ repository, publisher, confirmationDelayMs }: Dependencies): FastifyInstance;
export {};
