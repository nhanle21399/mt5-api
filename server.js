const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text());

let latestTrade = {};

app.post("/update", (req, res) => {
  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    latestTrade = data;

    console.log("New trade:", latestTrade);
    res.sendStatus(200);
  } catch (err) {
    console.log("Parse error:", err);
    res.sendStatus(400);
  }
});

app.get("/trade", (req, res) => {
  res.json(latestTrade);
});

app.listen(3000, () => console.log("Server running"));
