const axios = require('axios');

const LOG_URL = 'http://20.207.122.201/evaluation-service/logs';

let AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhczE0NTFAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMzgwMiwiaWF0IjoxNzc3NzAyOTAyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYWI2ZWY2ZjMtNmE1Zi00YjNlLTg2ODMtMWNkNmFkYjE3MzVkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWlyYSBrIHNhbGlzaCIsInN1YiI6IjJmMzkwZGVhLWNiZTUtNDZkZi1hNjA5LTIxN2FjMDNlN2U0MyJ9LCJlbWFpbCI6ImFzMTQ1MUBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImFpcmEgayBzYWxpc2giLCJyb2xsTm8iOiJyYTIzMTEwMjYwMTEwMTciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIyZjM5MGRlYS1jYmU1LTQ2ZGYtYTYwOS0yMTdhYzAzZTdlNDMiLCJjbGllbnRTZWNyZXQiOiJNa1REcEtTQ2N0eXVWRkdxIn0.prJ23SCVb0Mz12z0qQcLM2FveH5FGy1jnMv9MYscfEM';

function setToken(token) {
  AUTH_TOKEN = token;
}

// Valid values — lowercase only
const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = [
  'cache', 'controller', 'cron_job', 'db',
  'handler', 'repository', 'router', 'service'
];

async function Log(stack, level, pkg, message) {
  if (!VALID_STACKS.includes(stack)) return;
  if (!VALID_LEVELS.includes(level)) return;
  if (!VALID_PACKAGES.includes(pkg)) return;

  try {
    await axios.post(LOG_URL, {
      stack,
      level,
      package: pkg,
      message
    }, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    // never crash the app if logging fails
  }
}

module.exports = { Log, setToken };