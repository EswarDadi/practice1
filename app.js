const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;
const IntializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
    process.exit(1);
  }
};
IntializeDbAndServer();

// get players api
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
        SELECT
        *
        FROM
        cricket_team
        ORDER BY
        player_id
    `;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});
// create players api
app.post("/players/", async (request, response) => {
  const newPlayer = request.body;
  const playerDetails = {
    playerName: "Vishal",
    jerseyNumber: 17,
    role: "Bowler",
  };
  const playerQuery = `
  INSERT INTO 
  cricket_team(playerName,jerseyNumber,role)
  VALUES('${playerName}',
    '${jerseyNumber}',
    '${role}'
    );
  `;
  const dbResponse = await db.run(playerQuery);
  const playerId = dbResponse.lastId;
  response.send({ playerId: playerId });
});
// get player using playerId api
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
    *
    FROM
    cricket_team
    WHERE
    player_id=${playerId}
    `;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

module.exports = app;
