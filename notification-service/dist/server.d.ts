import { type FastifyInstance } from 'fastify';
import type { NotificationRepository } from './repository';
export declare function createNotificationServer(repository: NotificationRepository): FastifyInstance;
