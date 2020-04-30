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
    const { redId, blueId, result } = matchData

    let contract, red, blue, pairs, assignK, redK, blueK, rank, winProbRed, winProbBlue, newRankRed, newRankBlue

    contract = await ContractData.getContractByContractId(contractId)
    red = await PlayerData.getPlayerById(redId)
    blue = await PlayerData.getPlayerById(blueId)

    pairs = [[red, redK], [blue, blueK]]

    assignK = pairs.map((pair) => {
        if (pair[0].record >= 0 && pair[0].record <= 12) pair[1] = 40
        else if (pair[0].record >= 13 && pair[0].record <= 24) pair[1] = 24
        else pair[1] = 16
        return pair[1]
    })

    redK = assignK[0]
    blueK = assignK[1]

    //update: contract status, result, completed
    //update: player record

    rank = contract.data.rules.toLowerCase()

    winProbRed = 1 / (1 + 10 ** ((blue[rank] - red[rank]) / 400))
    winProbBlue = 1 / (1 + 10 ** ((red[rank] - blue[rank]) / 400))

    newRankRed = red[rank] + (redK * (results[result] - winProbRed))
    newRankBlue = blue[rank] + (blueK * (Math.abs(results[result] - 1) - winProbBlue))

    try {
        await AdminData.updatePlayerRankById(red.id, { [rank]: Math.round(newRankRed) })
        await AdminData.updatePlayerRankById(blue.id, { [rank]: Math.round(newRankBlue) })
        return ({ status: 200, data: 'Ranks updated successfully' })
    } catch (e) {
        return ({ status: 400, data: 'Error, check services/admin/updatePlayerRanksByid' })
    }
}

module.exports = {
    updatePlayerRanksById
}
