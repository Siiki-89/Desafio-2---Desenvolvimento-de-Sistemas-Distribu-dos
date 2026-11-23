"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationServer = createNotificationServer;
const fastify_1 = __importDefault(require("fastify"));
function createNotificationServer(repository) {
    const app = (0, fastify_1.default)({ logger: false });
    app.get('/notifications', async () => repository.list());
    app.get('/health', async () => ({ status: 'ok', service: 'notification' }));
    return app;
}
//# sourceMappingURL=server.js.map