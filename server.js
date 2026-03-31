const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json()); // parse JSON

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

    if (!data.trades) return res.sendStatus(400);

    let trades = data.trades;

    function isTodayVN(timestamp) {
      const now = new Date();
      const vnNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      const tradeDate = new Date(timestamp * 1000);
      const vnTrade = new Date(tradeDate.getTime() + 7 * 60 * 60 * 1000);

      return vnNow.toDateString() === vnTrade.toDateString();
    }

    let tradesTodayList = trades.filter(t => isTodayVN(t.time));

    let profitToday = tradesTodayList.reduce((sum, t) => sum + (t.profit || 0), 0);

    let wins = trades.filter(t => t.profit > 0).length;
    let total = trades.length;

    let winrate = total > 0 ? (wins / total) * 100 : 0;

    latestTrade = {
  performance: {
    balance: data.performance?.balance || 0,
    winrate: Number(winrate.toFixed(1)),
    tradesToday: tradesTodayList.length,
    profitToday: Number(profitToday.toFixed(2))
  },

  // 🔥 GIỮ TRADE CŨ nếu không có trade mới
  trades: (trades && trades.length > 0)
    ? trades
    : latestTrade.trades
};

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.get("/trade", (req, res) => {
  res.json(latestTrade);
});

app.listen(3000, () => console.log("Server running on port 3000"));
