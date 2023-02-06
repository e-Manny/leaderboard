const { writeFile } = require("fs");
const leaderboard = require("./leaderboard.json");
const path = "./leaderboard.json";
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/leaderboard/:rank", (req, res) => {
  const { rank } = req.params;
  let response = [];
  let counter = 0;
  for (let placing of leaderboard) {
    if (counter === 10) {
      break;
    } else if (placing["rank"] >= rank) {
      response.push(placing);
      counter++;
    }
  }
  res.send(response);
});

app.get("/api/users/:username", (req, res) => {
  const { username } = req.params;
  let response = [];
  for (let placing of leaderboard) {
    if (placing["username"] === username) {
      response.push(placing);
    }
  }
  res.send(response);
});

app.post("/api/leaderboard", (req, res) => {
  let board = [];
  if (leaderboard.length === 0) {
    board.push(req.body);
    const data = JSON.stringify(board);
    writeFile(path, data, (error) => {
      if (error) {
        res.send("false");
      } else {
        res.send("true");
      }
    });
  } else {
    for (let placing of leaderboard) {
      board.push(placing);
    }
    const { score } = req.body;
    let counter = 0;
    for (let placing of leaderboard) {
      if (score >= placing["score"]) {
        board.splice(counter, 0, req.body);
        const data = JSON.stringify(board);
        writeFile(path, data, (error) => {
          if (error) {
            res.send("false");
          } else {
            res.send("true");
          }
        });
        break;
      } else {
        counter++;
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Leaderboard microservice listening on port ${port}...`);
});
