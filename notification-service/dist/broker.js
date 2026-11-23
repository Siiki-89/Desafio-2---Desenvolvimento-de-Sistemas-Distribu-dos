"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConsumer = startConsumer;
async function startConsumer(channel, repository) {
    await channel.assertExchange('payments', 'topic', { durable: true });
    const queue = await channel.assertQueue('notification-service', { durable: true });
    await channel.bindQueue(queue.queue, 'payments', 'payment.events');
    await channel.consume(queue.queue, async (message) => {
        if (!message)
            return;
        try {
            const event = JSON.parse(message.content.toString());
            const notification = await repository.createFromEvent(event);
            if (notification)
                console.log(`[notification] ${notification.message} -> ${notification.recipient}`);
            channel.ack(message);
        }
        catch (error) {
            console.error('[notification] failed to process event', error);
            channel.nack(message, false, false);
        }
    });
}
//# sourceMappingURL=broker.js.map