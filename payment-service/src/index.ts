import amqp from 'amqplib';
import { createPaymentDatabase, ensurePaymentSchema } from './db';
import { loadConfig } from './config';
import { createPaymentServer } from './server';

async function main(): Promise<void> {
  const config = loadConfig();
  const { pool, repository } = createPaymentDatabase(config.postgresUrl);
  await ensurePaymentSchema(pool);
  const connection = await amqp.connect(config.rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertExchange('payments', 'topic', { durable: true });
  const publisher = { publish: async (event: object): Promise<void> => { channel.publish('payments', 'payment.events', Buffer.from(JSON.stringify(event)), { persistent: true, contentType: 'application/json' }); } };
  const app = createPaymentServer({ repository, publisher, confirmationDelayMs: config.confirmationDelayMs });
  await app.listen({ port: config.port, host: '0.0.0.0' });
  console.log(`payment-service listening on ${config.port}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
