# CompreFácil

```bash
npm install
npm test
npm run build
docker compose up --build
```

```bash
curl -X POST http://localhost:3001/payments \
  -H "content-type: application/json" \
  -d '{"customerEmail":"cliente@example.com","amount":149.90}'
```

```bash
curl http://localhost:3001/payments/<id>
curl http://localhost:3002/notifications
```
