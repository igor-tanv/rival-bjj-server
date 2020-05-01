const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const AdminData = require('../../data/AdminData')

methodValues = {
    submission: 1,
    disqualification: 1,
    forfeit: 1,
    injury: 1,
    points: 0.85,
    advantage: 0.75,
    draw: 0.5
}

// const results = {
//     wbt: 1,
//     wbdq: 1,
//     wbf: 1,
//     wbi: 1,
//     wbp: 0.85,
//     wba: 0.75,
//     d: 0.5,
//     lba: 0.25,
//     lbp: 0.15,
//     lbi: 0,
//     lbf: 0,
//     lbdq: 0,
//     lbt: 0,
// }

const updatePlayerRanksById = async (contractId, matchData) => {
    const { redId, blueId, winner, method } = matchData

    let contract, red, blue, pairs, assignK, redK, blueK, rank, winProbRed, winProbBlue, newRankRed, newRankBlue

    contract = await ContractData.getContractByContractId(contractId)
    red = await PlayerData.getPlayerById(redId)
    blue = await PlayerData.getPlayerById(blueId)

    pairs = [[red, redK], [blue, blueK]]

    //assign K based on number of matches player has had
    assignK = pairs.map((pair) => {
        if (pair[0].record >= 0 && pair[0].record <= 12) pair[1] = 40
        else if (pair[0].record >= 13 && pair[0].record <= 24) pair[1] = 24
        else pair[1] = 16
        return pair[1]
    })
    redK = assignK[0]
    blueK = assignK[1]

    //gi or nogi
    rank = contract.data.rules.toLowerCase()

    winProbRed = 1 / (1 + 10 ** ((blue[rank] - red[rank]) / 400))
    winProbBlue = 1 / (1 + 10 ** ((red[rank] - blue[rank]) / 400))

    // negative 1 absolute difference inverts the score for losing player
    if (redId == winner) {
        newRankRed = red[rank] + (redK * (methodValues[method] - winProbRed))
        newRankBlue = blue[rank] + (blueK * (Math.abs(methodValues[method] - 1) - winProbBlue))
    } else if(blueId == winner) {
        newRankRed = red[rank] + (redK * (Math.abs(methodValues[method] - 1) - winProbRed))
        newRankBlue = blue[rank] + (blueK * (methodValues[method] - winProbBlue))
    }

    try {
        //need to update contract by id
        //NEXT: update: player record
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
