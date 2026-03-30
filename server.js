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

    // Kiểm tra performance + trades
    if (!data.performance || !data.trades) {
      console.log("Invalid data received:", data);
      return res.sendStatus(400);
    }

    latestTrade = data;

    console.log("New performance:", latestTrade.performance);
    console.log("New trades:", latestTrade.trades);

    res.sendStatus(200);
  } catch (err) {
    console.log("Parse error:", err);
    res.sendStatus(400);
  }
});

app.get("/trade", (req, res) => {
  res.json(latestTrade);
});

app.listen(3000, () => console.log("Server running on port 3000"));
