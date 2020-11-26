const { getPlayer } = require('./getPlayer')
const PlayersData = require('../../data/PlayerData');
const PlayerData = require('../../data/PlayerData');

const updatePlayer = async (playerId, updates) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'birthYear', 'weightClass', 'school', 'gender', 'avatar']

    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((newUpdates, key) => {
        newUpdates[key] = updates[key];
        return newUpdates;
      }, {});
    const player = await PlayerData.updatePlayer(playerId, filteredUpdates)
    return ({ status: 200, data: player })
  }
  catch (err) {
    //await sendAdminEmail(player)
    return ({ status: 500, data: err })
  }
}

module.exports = {
  updatePlayer,
}