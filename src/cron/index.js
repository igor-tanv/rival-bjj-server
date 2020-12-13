process.once("database:ready", () => {
  require('./delete-unconfirmed-players')
})