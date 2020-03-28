const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')

const getContracts = async (id) => {
  //HERE
  let contracts = await ContractData.getContractsByPlayerOrOpponentId(id)
  const processedContracts = contracts.map(async (contract) => {
      let opponent;
      if (id == contract.playerId) { 
        opponent = await PlayerData.getPlayerById(contract.opponentId)
        } 
      else { 
        opponent = await PlayerData.getPlayerById(contract.playerId)
        }
      if(opponent) {  
      date = new Date(contract.datetime * 1000)
      let months = ["", "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
      let month = months[date.getMonth()]
      let minutes = date.getMinutes()
      if (minutes == 0) {
          minutes = '00'
      }
      contract['date'] = {
          "year": date.getFullYear(),
          month,
          "day": date.getDate(),
          "hour": date.getHours(),
          minutes
      }
      contract['opponent'] = {
          "avatar": opponent.avatar,
          "first": opponent.firstName,
          "last": opponent.lastName,
          "school": opponent.school
      }
      return contract
    }
  }) 
  return processedContracts
}

module.exports = {
  getContracts
}