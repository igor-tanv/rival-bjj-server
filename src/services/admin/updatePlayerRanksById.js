const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const AdminData = require('../../data/AdminData')

const results = {
    wbt: 1,
    wbdq: 1,
    wbf: 1,
    wbi: 1,
    wbp: 0.85,
    wba: 0.75,
    d: 0.5,
    lba: 0.25,
    lbp: 0.15,
    lbi: 0,
    lbf: 0,
    lbdq: 0,
    lbt: 0,
}


const updatePlayerRanksById = async (contractId, matchData) => {
   const {redId, blueId, result} = matchData

    let K = 50

    let contract = await ContractData.getContractByContractId(contractId)
    let red = await PlayerData.getPlayerById(redId)
    let blue = await PlayerData.getPlayerById(blueId)

    //gi or nogi
    let rank = contract.data.rules.toLowerCase()

    let winProbRed = 1 / (1 + 10 ** ((blue[rank] - red[rank]) / 400))
    let winProbBlue = 1 / (1 + 10 ** ((red[rank] - blue[rank]) / 400))

    let newRankRed = red[rank] + (K * (results[result] - winProbRed))
    let newRankBlue = blue[rank] + (K * (Math.abs(results[result]-1) - winProbBlue))
    
    await AdminData.updatePlayerRankById(red.id ,{[rank]: newRankRed })
    await AdminData.updatePlayerRankById(blue.id ,{[rank]: newRankBlue })


}

module.exports = {
    updatePlayerRanksById
}
