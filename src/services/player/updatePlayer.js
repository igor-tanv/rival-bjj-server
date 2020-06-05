const multipart = require('connect-multiparty')
const path = require('../../path')
const fs = require('fs')
const { getPlayer } = require('./getPlayer')
const PlayersData = require('../../data/PlayerData')

const updatePlayer = async (playerId, updates, avatar) => {

  const arrFile = avatar.path.split('/')
  updates.avatar = arrFile[arrFile.length - 1]


  // if no avatar undo empty upload created by multipart
  if (avatar.size == 0) {
    fs.unlink(path.PUBLIC.AVATAR_PICTURES + '/' + updates.avatar, function (err) {
      if (err) throw err
    })
    updates.avatar = ''
  } else if (avatar.size != 0) {
    const player = await getPlayer(playerId)
    fs.unlink(path.PUBLIC.AVATAR_PICTURES + '/' + player.avatar, function (err) {
      if (err) throw err
    })
  }

  let filteredU = Object.keys(updates).reduce((filter, update) => {
    if (updates[update]) filter[update] = updates[update];
    return filter;
  }, {});

  return await PlayersData.updatePlayer(playerId, filteredU)
}

module.exports = {
  updatePlayer,
}