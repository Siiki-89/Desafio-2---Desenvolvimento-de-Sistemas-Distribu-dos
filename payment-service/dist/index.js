"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const db_1 = require("./db");
const config_1 = require("./config");
const server_1 = require("./server");
async function main() {
    const config = (0, config_1.loadConfig)();
    const { pool, repository } = (0, db_1.createPaymentDatabase)(config.postgresUrl);
    await (0, db_1.ensurePaymentSchema)(pool);
    const connection = await amqplib_1.default.connect(config.rabbitmqUrl);
    const channel = await connection.createChannel();
    await channel.assertExchange('payments', 'topic', { durable: true });
    const publisher = { publish: async (event) => { channel.publish('payments', 'payment.events', Buffer.from(JSON.stringify(event)), { persistent: true, contentType: 'application/json' }); } };
    const app = (0, server_1.createPaymentServer)({ repository, publisher, confirmationDelayMs: config.confirmationDelayMs });
    await app.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`payment-service listening on ${config.port}`);
}
main().catch((error) => { console.error(error); process.exit(1); });
//# sourceMappingURL=index.js.map