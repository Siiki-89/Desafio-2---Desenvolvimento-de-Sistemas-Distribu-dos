import amqp from 'amqplib';
import { loadConfig } from './config';
import { createNotificationDatabase, ensureNotificationSchema } from './db';
import { startConsumer } from './broker';
import { createNotificationServer } from './server';

async function main(): Promise<void> {
  const config = loadConfig();
  const { pool, repository } = createNotificationDatabase(config.postgresUrl);
  await ensureNotificationSchema(pool);
  const connection = await amqp.connect(config.rabbitmqUrl);
  const channel = await connection.createChannel();
  await startConsumer(channel, repository);
  const app = createNotificationServer(repository);
  await app.listen({ port: config.port, host: '0.0.0.0' });
  console.log(`notification-service listening on ${config.port}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
