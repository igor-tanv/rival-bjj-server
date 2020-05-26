const multipart = require('connect-multiparty')
const path = require('../../path')

const PlayersData = require('../../data/PlayerData')

const updatePlayer = async (playerId, updates, avatar) => {

  if (avatar) {
    //need to delete old avatar if new one is uploaded
    const arrFile = avatar.path.split('/')
    updates.avatar = arrFile[arrFile.length - 1]
  }

  let filtered  = Object.keys(updates).reduce((filter, update) => {    
    if (updates[update]) filter[update] = updates[update];
    return filter;
  }, {});

  console.log(filtered)

  //NEXT: clear all players and check the updated avatar, 
  
  //return await PlayersData.updatePlayer(playerId, updates)
}

module.exports = {
  updatePlayer,
}