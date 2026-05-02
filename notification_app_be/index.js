const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const BASE = 'http://20.207.122.201/evaluation-service';


const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhczE0NTFAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMzgwMiwiaWF0IjoxNzc3NzAyOTAyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYWI2ZWY2ZjMtNmE1Zi00YjNlLTg2ODMtMWNkNmFkYjE3MzVkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWlyYSBrIHNhbGlzaCIsInN1YiI6IjJmMzkwZGVhLWNiZTUtNDZkZi1hNjA5LTIxN2FjMDNlN2U0MyJ9LCJlbWFpbCI6ImFzMTQ1MUBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImFpcmEgayBzYWxpc2giLCJyb2xsTm8iOiJyYTIzMTEwMjYwMTEwMTciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIyZjM5MGRlYS1jYmU1LTQ2ZGYtYTYwOS0yMTdhYzAzZTdlNDMiLCJjbGllbnRTZWNyZXQiOiJNa1REcEtTQ2N0eXVWRkdxIn0.prJ23SCVb0Mz12z0qQcLM2FveH5FGy1jnMv9MYscfEM';

const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

app.get('/notifications/top', async (req, res) => {
  const n = parseInt(req.query.n) || 10;

  try {
    const data = await axios.get(`${BASE}/notifications`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const notifications = data.data.notifications;

    const scored = notifications.map(n => {
      const weight = TYPE_WEIGHT[n.Type] || 0;
      const recency = new Date(n.Timestamp).getTime();
      const score = weight * 1000000000000 + recency;
      return { ...n, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topN = scored.slice(0, n);

    res.json({
      total: notifications.length,
      showing: topN.length,
      notifications: topN.map(({ score, ...rest }) => rest)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3002, () => {
  console.log('Notification app on http://localhost:3002');
});