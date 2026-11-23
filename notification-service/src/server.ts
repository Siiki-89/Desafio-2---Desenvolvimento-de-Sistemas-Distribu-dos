import Fastify, { type FastifyInstance } from 'fastify';
import type { NotificationRepository } from './repository';

export function createNotificationServer(repository: NotificationRepository): FastifyInstance {
  const app = Fastify({ logger: false });
  app.get('/notifications', async () => repository.list());
  app.get('/health', async () => ({ status: 'ok', service: 'notification' }));
  return app;
}
