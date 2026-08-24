import express from 'express';
const app = express(); app.use(express.json({ limit: '1mb' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.post('/v1/quotes', (_req, res) => res.status(503).json({ error: 'Pricing database integration is required before live quoting.' }));
app.listen(process.env.PORT || 3001);
