const express = require("express");
const app = express();

const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

let db = null;

app.use(express.json());

const cricketTeamDBPath = path.join(__dirname, "cricketTeam.db");

const initializeDBConnectionAndServer = async () => {
  try {
    db = await open({
      filename: cricketTeamDBPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Database error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBConnectionAndServer();

app.get("/players/", async (request, response) => {
  const querySelector = `
      SELECT * FROM cricket_team
      `;
  const players = await db.all(querySelector);
  response.send(players);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const querySelector = `INSERT INTO cricket_team(player_name, jersey_number, role) VALUES(${playerName}, ${jerseyNumber}, ${role})`;
  const players = await db.run(querySelector);
  console.log(players);
  const playerId = players.lastID;
  response.send(players);
});
