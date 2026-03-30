const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let latestTrade = {};

app.post("/update", (req, res) => {
  latestTrade = req.body;
  console.log("New trade:", latestTrade);
  res.sendStatus(200);
});

app.get("/trade", (req, res) => {
  res.json(latestTrade);
});

app.listen(3000, () => console.log("Server running"));