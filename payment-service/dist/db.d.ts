import { Pool } from 'pg';
import type { PaymentRepository } from './repository';
export declare function createPaymentDatabase(connectionString: string): {
    pool: Pool;
    repository: PaymentRepository;
};
export declare function ensurePaymentSchema(pool: Pool): Promise<void>;
