"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const config_1 = require("./config");
const db_1 = require("./db");
const broker_1 = require("./broker");
const server_1 = require("./server");
async function main() {
    const config = (0, config_1.loadConfig)();
    const { pool, repository } = (0, db_1.createNotificationDatabase)(config.postgresUrl);
    await (0, db_1.ensureNotificationSchema)(pool);
    const connection = await amqplib_1.default.connect(config.rabbitmqUrl);
    const channel = await connection.createChannel();
    await (0, broker_1.startConsumer)(channel, repository);
    const app = (0, server_1.createNotificationServer)(repository);
    await app.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`notification-service listening on ${config.port}`);
}
main().catch((error) => { console.error(error); process.exit(1); });
//# sourceMappingURL=index.js.map