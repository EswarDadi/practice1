const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
module.exports = app;
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
  const { player_name, jersey_number, role } = newPlayer;
  const playerQuery = `
  INSERT INTO 
  cricket_team(playerName,jerseyNumber,role)
  VALUES(${player_id},'${player_name}',
    ${jersey_number},
    '${role}'
    );
  `;
  const dbResponse = await db.run(playerQuery);
  const playerid = dbResponse.lastId;
  response.send({ playerid: playerId });
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
// update api call
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE
    cricket_team
    SET 
    playerId=${player_id},
    playerName='${player_name}',
    jerseyNumber=${jersey_number},
    role='${role}'
    WHERE
    player_id=${playerId};
    `;
  await db.run(updatePlayerQuery);
  response.send("player profile updated successfully");
});
// delete api
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
    DELETE FROM 
    cricket_team
    WHERE
    player_id=${playerId};
    `;
  await db.run(deleteQuery);
  response.send("Deleted successfully");
});
