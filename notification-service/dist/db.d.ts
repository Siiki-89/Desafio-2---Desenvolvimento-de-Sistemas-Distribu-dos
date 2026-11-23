import { Pool } from 'pg';
import type { NotificationRepository } from './repository';
export declare function createNotificationDatabase(connectionString: string): {
    pool: Pool;
    repository: NotificationRepository;
};
export declare function ensureNotificationSchema(pool: Pool): Promise<void>;
