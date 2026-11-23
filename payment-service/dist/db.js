"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentDatabase = createPaymentDatabase;
exports.ensurePaymentSchema = ensurePaymentSchema;
const pg_1 = require("pg");
function createPaymentDatabase(connectionString) {
    const pool = new pg_1.Pool({ connectionString });
    const repository = {
        async create(input) {
            const result = await pool.query('INSERT INTO payments (id, customer_email, amount, status) VALUES ($1, $2, $3, $4) RETURNING *', [input.id, input.customerEmail, input.amount, 'PENDING']);
            return mapRow(result.rows[0]);
        },
        async findById(id) {
            const result = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
            return result.rows[0] ? mapRow(result.rows[0]) : null;
        },
        async markSuccess(id) {
            const result = await pool.query("UPDATE payments SET status = 'SUCCESS', updated_at = NOW() WHERE id = $1 RETURNING *", [id]);
            return result.rows[0] ? mapRow(result.rows[0]) : null;
        },
    };
    return { pool, repository };
}
function mapRow(row) {
    return { id: row.id, customerEmail: row.customer_email, amount: Number(row.amount), status: row.status, createdAt: new Date(row.created_at).toISOString(), updatedAt: new Date(row.updated_at).toISOString() };
}
async function ensurePaymentSchema(pool) {
    await pool.query(`CREATE TABLE IF NOT EXISTS payments (id UUID PRIMARY KEY, customer_email TEXT NOT NULL, amount NUMERIC(12,2) NOT NULL, status TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
}
//# sourceMappingURL=db.js.map