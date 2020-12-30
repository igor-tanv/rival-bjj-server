const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')

const getAllContractsByPlayerId = async (id) => {
  return ContractData.getContractsByPlayerOrOpponentId(id).then(async contracts => {
    const playerData = await PlayerData.getPlayerById(id);
    const result = await Promise.all(contracts.map(async contract => {
      const c = contract.toObject({ getters: true });
      if (c.playerId.toString() === id) {
        c.playerGiRank = playerData.gi;
        c.playerNoGiRank = playerData.nogi;
        const opponent = await PlayerData.getPlayerById(c.opponentId);
        c.opponentGiRank = opponent.gi;
        c.opponentNoGiRank = opponent.nogi;
      }
      if (c.opponentId.toString() === id) {
        c.opponentGiRank = playerData.gi;
        c.opponentNoGiRank = playerData.nogi;
        const opponent = await PlayerData.getPlayerById(c.playerId);
        c.playerGiRank = opponent.gi;
        c.playerNoGiRank = opponent.nogi;
      }
      return c
    }));
    return result;
  })
}

module.exports = {
  getAllContractsByPlayerId,
}