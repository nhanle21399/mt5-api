const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let latestTrade = {
  performance: {
    balance: 0,
    winrate: 0,
    tradesToday: 0,
    profitToday: 0
  },
  trades: []
};

app.post("/update", (req, res) => {
  try {
    const data = req.body;

    if (!data.performance || !Array.isArray(data.trades)) {
      console.log("Invalid data:", data);
      return res.sendStatus(400);
    }

    const trades = data.trades;

    // --- Tính performance dựa trên live positions ---
    const tradesToday = trades.length; // số vị thế mở
    const profitToday = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const wins = trades.filter(t => t.profit > 0).length;
    const winrate = tradesToday > 0 ? (wins / tradesToday) * 100 : 0;

    latestTrade = {
      performance: {
        balance: Number((data.performance.balance || 0).toFixed(2)),
        winrate: Number(winrate.toFixed(1)),
        tradesToday,
        profitToday: Number(profitToday.toFixed(2))
      },
      trades
    };

    return res.sendStatus(200);

  } catch (err) {
    console.error("POST /update error:", err);
    return res.sendStatus(500);
  }
});

app.get("/trade", (req, res) => {
  res.json(latestTrade);
});

app.listen(3000, () => console.log("Server running on port 3000"));
