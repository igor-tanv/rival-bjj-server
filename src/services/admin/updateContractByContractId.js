const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const PlayerService = require('../player')

const updateContractByContractId = async (contractId, contractData) => {
  const { winner, method, redRating, blueRating, refereeComments } = contractData

  if (winner === '') return

  // update contract
  if (winner === 'cancelled') {
    return await ContractData.cancelContract(contractId)
  }

  let result = ''
  if (winner === 'red') result = 'win'
  if (winner === 'blue') result = 'loss'
  if (winner === 'draw') result = 'draw'

  const contract = await ContractData.updateContract(contractId, {
    result,
    playerQualityRating: parseInt(redRating),
    opponentQualityRating: parseInt(blueRating),
    method,
    refereeComments,
    completedAt: new Date()
  })

  //update player ranks
  let red = await PlayerService.getPlayer(contract.data.playerId)
  let blue = await PlayerService.getPlayer(contract.data.opponentId)

  function assignK(player) {
    const playerRecord = player.wins + player.losses + player.draws
    if ((playerRecord >= 0 && playerRecord <= 12)) return 80
    if ((playerRecord >= 13 && playerRecord <= 24)) return 40
    return 20
  }

  const matchType = contract.data.type
  const winProbRed = 1 / (1 + 10 ** ((blue[matchType] - red[matchType]) / 400))
  const winProbBlue = 1 / (1 + 10 ** ((red[matchType] - blue[matchType]) / 400))

  // refactor 
  if (winner === 'draw') {
    newRankRed = red[matchType] + (assignK(red) * (0.5 - winProbRed))
    newRankBlue = blue[matchType] + (assignK(blue) * (0.5 - winProbBlue))
  }
  if (winner === 'red') {
    newRankRed = red[matchType] + (assignK(red) * (1 - winProbRed))
    newRankBlue = blue[matchType] + (assignK(blue) * (0 - winProbBlue))
  }
  if (winner === 'blue') {
    newRankRed = red[matchType] + (assignK(red) * (0 - winProbRed))
    newRankBlue = blue[matchType] + (assignK(blue) * (1 - winProbBlue))
  }

  newRankRed = Math.round(newRankRed)
  newRankBlue = Math.round(newRankBlue)

  if (matchType === 'gi') {
    await PlayerData.updatePlayer(red.id, { gi: newRankRed })
    await PlayerData.updatePlayer(blue.id, { gi: newRankBlue })
  }
  if (matchType === 'nogi') {
    await PlayerData.updatePlayer(red.id, { nogi: newRankRed })
    await PlayerData.updatePlayer(blue.id, { nogi: newRankBlue })
  }
  return
}

module.exports = {
  updateContractByContractId
}
