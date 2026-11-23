import { Pool } from 'pg';
import type { NotificationRepository } from './repository';
import type { PaymentEvent } from '@compre-facil/contracts/events';

export function createNotificationDatabase(connectionString: string): { pool: Pool; repository: NotificationRepository } {
  const pool = new Pool({ connectionString });
  const repository: NotificationRepository = {
    async createFromEvent(event: PaymentEvent) {
      const result = await pool.query(`INSERT INTO notifications (id, event_id, payment_id, recipient, message) VALUES (gen_random_uuid(), $1, $2, $3, $4) ON CONFLICT (event_id) DO NOTHING RETURNING *`, [event.eventId, event.paymentId, event.customerEmail, event.type === 'payment.requested' ? 'Recebemos sua solicitação de pagamento.' : 'Seu pagamento foi confirmado com sucesso.']);
      return result.rows[0] ? mapRow(result.rows[0]) : null;
    },
    async list() { const result = await pool.query('SELECT * FROM notifications ORDER BY created_at ASC'); return result.rows.map(mapRow); },
  };
  return { pool, repository };
}

function mapRow(row: any) { return { id: row.id, eventId: row.event_id, paymentId: row.payment_id, recipient: row.recipient, message: row.message, createdAt: new Date(row.created_at).toISOString() }; }
export async function ensureNotificationSchema(pool: Pool): Promise<void> { await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto'); await pool.query(`CREATE TABLE IF NOT EXISTS notifications (id UUID PRIMARY KEY, event_id UUID NOT NULL UNIQUE, payment_id UUID NOT NULL, recipient TEXT NOT NULL, message TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`); }
