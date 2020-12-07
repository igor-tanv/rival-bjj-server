const ContractData = require('../../data/ContractData')
const PlayerData = require('../../data/PlayerData')
const AdminData = require('../../data/AdminData')
const contractServices = require('../contract/createContract')


methodValues = {
    submission: 1,
    disqualification: 1,
    forfeit: 1,
    injury: 1,
    draw: 0.5
}

const updatePlayerById = async (contractId, matchData) => {
    const { redId, blueId, winner, method, status, redRating, blueRating } = matchData

    if (status == 'cancelled') {
        let cancelled = contractServices.enumStatus[status]
        await ContractData.updateContract(contractId, { 'status': cancelled, 'winner': 'N/A' })
        return ({ status: 200, data: 'Match has been cancelled' })
    } else if (status == 'completed') {
        let completed = contractServices.enumStatus[status]
        await ContractData.updateContract(contractId, { 'status': completed, 'winner': winner, 'method': method })
    }

    //updating ratings based on player feedback. If rating not provided, default to 5
    //consolidate into one db call
    await AdminData.updatePlayerById(redId, { $inc: { sumRating: redRating } })
    await AdminData.updatePlayerById(blueId, { $inc: { sumRating: blueRating } })

    let contract, red, blue, pairs, assignK, redK, blueK, rank, winProbRed, winProbBlue, newRankRed, newRankBlue

    contract = await ContractData.getContractByContractId(contractId)
    red = await PlayerData.getPlayerById(redId)
    blue = await PlayerData.getPlayerById(blueId)

    red['record'] = red.wins + red.losses + red.draws
    blue['record'] = blue.wins + blue.losses + blue.draws
    pairs = [[red, redK], [blue, blueK]]

    //assign K based on total number of matches a player has had
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

    // Absolute difference inverts negative score for losing player
    // if there is a draw, both conditional blocks will output correct result
    if (redId == winner) {
        newRankRed = red[rank] + (redK * (methodValues[method] - winProbRed))
        newRankBlue = blue[rank] + (blueK * (Math.abs(methodValues[method] - 1) - winProbBlue))
    } else if (blueId == winner) {
        newRankRed = red[rank] + (redK * (Math.abs(methodValues[method] - 1) - winProbRed))
        newRankBlue = blue[rank] + (blueK * (methodValues[method] - winProbBlue))
    } else if (winner == 'none') {
        newRankRed = red[rank] + (redK * (Math.abs(methodValues[method] - 1) - winProbRed))
        newRankBlue = blue[rank] + (blueK * (methodValues[method] - winProbBlue))
    }
    newRankRed = Math.round(newRankRed)
    newRankBlue = Math.round(newRankBlue)

    //update contract status
    await ContractData.updateContract(contractId)

    if (redId == winner) {
        await AdminData.updatePlayerById(red.id, { [rank]: newRankRed, $inc: { wins: 1 } })
        await AdminData.updatePlayerById(blue.id, { [rank]: newRankBlue, $inc: { losses: 1 } })
        return ({ status: 200, data: 'Ranks updated successfully' })
    } else if (blueId == winner) {
        await AdminData.updatePlayerById(red.id, { [rank]: newRankRed, $inc: { losses: 1 } })
        await AdminData.updatePlayerById(blue.id, { [rank]: newRankBlue, $inc: { wins: 1 } })
        return ({ status: 200, data: 'Ranks updated successfully' })
    } else if (method == 'draw') {
        await AdminData.updatePlayerById(red.id, { [rank]: newRankRed, $inc: { draws: 1 } })
        await AdminData.updatePlayerById(blue.id, { [rank]: newRankBlue, $inc: { draws: 1 } })
        return ({ status: 200, data: 'Ranks updated successfully' })
    }
    return ({ status: 400, data: 'Error, check services/admin/updatePlayerRanksByid' })
}

module.exports = {
    updatePlayerById
}
