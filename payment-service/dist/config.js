"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
function loadConfig(env = process.env) {
    const user = env.POSTGRES_USER ?? 'app';
    const password = env.POSTGRES_PASSWORD ?? 'app';
    const database = env.POSTGRES_DB ?? 'payments';
    const host = env.POSTGRES_HOST ?? 'localhost';
    const port = env.POSTGRES_PORT ?? '5432';
    return {
        port: Number(env.PAYMENT_PORT ?? 3001),
        postgresUrl: env.DATABASE_URL ?? `postgres://${user}:${password}@${host}:${port}/${database}`,
        rabbitmqUrl: env.RABBITMQ_URL ?? 'amqp://app:app@localhost:5672',
        confirmationDelayMs: Number(env.CONFIRMATION_DELAY_MS ?? 1000),
    };
}
//# sourceMappingURL=config.js.map