"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
function loadConfig(env = process.env) {
    return {
        port: Number(env.NOTIFICATION_PORT ?? 3002),
        postgresUrl: env.DATABASE_URL ?? `postgres://${env.POSTGRES_USER ?? 'app'}:${env.POSTGRES_PASSWORD ?? 'app'}@${env.POSTGRES_HOST ?? 'localhost'}:${env.POSTGRES_PORT ?? '5432'}/${env.POSTGRES_DB ?? 'payments'}`,
        rabbitmqUrl: env.RABBITMQ_URL ?? 'amqp://app:app@localhost:5672',
    };
}
//# sourceMappingURL=config.js.map