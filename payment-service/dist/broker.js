"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryPublisher = void 0;
class MemoryPublisher {
    events = [];
    async publish(event) { this.events.push(event); }
}
exports.MemoryPublisher = MemoryPublisher;
//# sourceMappingURL=broker.js.map