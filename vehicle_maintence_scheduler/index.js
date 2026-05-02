const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const BASE = 'http://20.207.122.201/evaluation-service';


const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhczE0NTFAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMzgwMiwiaWF0IjoxNzc3NzAyOTAyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYWI2ZWY2ZjMtNmE1Zi00YjNlLTg2ODMtMWNkNmFkYjE3MzVkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWlyYSBrIHNhbGlzaCIsInN1YiI6IjJmMzkwZGVhLWNiZTUtNDZkZi1hNjA5LTIxN2FjMDNlN2U0MyJ9LCJlbWFpbCI6ImFzMTQ1MUBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImFpcmEgayBzYWxpc2giLCJyb2xsTm8iOiJyYTIzMTEwMjYwMTEwMTciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIyZjM5MGRlYS1jYmU1LTQ2ZGYtYTYwOS0yMTdhYzAzZTdlNDMiLCJjbGllbnRTZWNyZXQiOiJNa1REcEtTQ2N0eXVWRkdxIn0.prJ23SCVb0Mz12z0qQcLM2FveH5FGy1jnMv9MYscfEM';

async function authGet(url) {
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  return res.data;
}

function knapsack(tasks, budget) {
  const n = tasks.length;
  const dp = new Array(budget + 1).fill(0);
  const selected = new Array(budget + 1).fill(null).map(() => []);

  for (let i = 0; i < n; i++) {
    const duration = tasks[i].Duration;
    const impact = tasks[i].Impact;
    for (let w = budget; w >= duration; w--) {
      if (dp[w - duration] + impact > dp[w]) {
        dp[w] = dp[w - duration] + impact;
        selected[w] = [...selected[w - duration], tasks[i].TaskID];
      }
    }
  }

  return {
    maxImpact: dp[budget],
    selectedTasks: selected[budget]
  };
}

app.get('/schedule', async (req, res) => {
  try {
    const depotData = await authGet(`${BASE}/depots`);
    const depots = depotData.depots;
    
    const vehicleData = await authGet(`${BASE}/vehicles`);
    const vehicles = vehicleData.vehicles;

    const schedule = [];
    for (const depot of depots) {
      const result = knapsack(vehicles, depot.MechanicHours);
      schedule.push({
        depotID: depot.ID,
        mechanicHoursBudget: depot.MechanicHours,
        maxImpactAchievable: result.maxImpact,
        selectedTaskIDs: result.selectedTasks
      });
    }

    res.json({ schedule });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/schedule/:depotID', async (req, res) => {
  const depotID = parseInt(req.params.depotID);

  try {
    const depotData = await authGet(`${BASE}/depots`);
    const vehicleData = await authGet(`${BASE}/vehicles`);

    const depot = depotData.depots.find(d => d.ID === depotID);
    if (!depot) {
      return res.status(404).json({ error: 'Depot not found' });
    }

    const result = knapsack(vehicleData.vehicles, depot.MechanicHours);
    res.json({
      depotID: depot.ID,
      mechanicHoursBudget: depot.MechanicHours,
      maxImpactAchievable: result.maxImpact,
      selectedTaskIDs: result.selectedTasks
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Vehicle scheduler on http://localhost:3001');
});