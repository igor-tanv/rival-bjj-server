const { cleanupUnconfirmedPlayers } = require("../data/PlayerData")

setInterval(cleanupUnconfirmedPlayers, 24 * 60 * 60 * 1000)

cleanupUnconfirmedPlayers()