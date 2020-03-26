const Contract = require('./models/contract')
const Player = require('./models/player')

export const ContractStatus = {
  Review = 1,
  Accepted = 2,
  Rejected = 3,
  Cancelled = 4,
  Completed = 5
}

export class ContractData {

  export static getContractById(contractId) {
    return Contract.findById(contractId)
  }

  export static getContractsByPlayerId(playerId) {
    return Contract.find({'player_id':playerId})
  }

  export static getContractsByOpponentId(opponentId) {
    return Contract.find({'opponent_id':opponentId})
  }

}