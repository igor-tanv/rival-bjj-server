const PlayersData = require('../../data/PlayerData')
const { addContractsRecordQualityratingToPlayer } = require('./getPlayer')


const getPlayers = async () => {
  let players = await PlayersData.getAllPlayers()
  return Promise.all(players.filter(p => p.confirmedAt != null && p.deletedAt === null).map(async (fp) => await addContractsRecordQualityratingToPlayer(fp)))
}

module.exports = {
  getPlayers,
}