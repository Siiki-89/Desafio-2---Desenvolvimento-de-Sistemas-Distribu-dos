import type { Channel } from 'amqplib';
import type { PaymentEvent } from '@compre-facil/contracts/events';
import type { NotificationRepository } from './repository';

export async function startConsumer(channel: Channel, repository: NotificationRepository): Promise<void> {
  await channel.assertExchange('payments', 'topic', { durable: true });
  const queue = await channel.assertQueue('notification-service', { durable: true });
  await channel.bindQueue(queue.queue, 'payments', 'payment.events');
  await channel.consume(queue.queue, async (message) => {
    if (!message) return;
    try { const event = JSON.parse(message.content.toString()) as PaymentEvent; const notification = await repository.createFromEvent(event); if (notification) console.log(`[notification] ${notification.message} -> ${notification.recipient}`); channel.ack(message); } catch (error) { console.error('[notification] failed to process event', error); channel.nack(message, false, false); }
  });
}
