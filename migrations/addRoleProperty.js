
require('../src/db/mongoose')
const mongoose = require("mongoose")

const Player = require('../src/models/player')

process.once("database:ready", async () => {
  const res = await Player.updateMany({
    role: { $exists: false }
  }, {
    $set: {
      role: Player.ROLES.PLAYER
    }
  })
  console.log("Done.", res)
  mongoose.disconnect()
  //process.exit(0)
})