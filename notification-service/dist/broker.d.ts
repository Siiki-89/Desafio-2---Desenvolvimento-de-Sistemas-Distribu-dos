import type { Channel } from 'amqplib';
import type { NotificationRepository } from './repository';
export declare function startConsumer(channel: Channel, repository: NotificationRepository): Promise<void>;
