const express = require('express')
const puppeteer = require('puppeteer');

const PlayerService = require('../services/player/index')
const ContractService = require('../services/contract/index')
const { ensureAuthenticated } = require('../middleware/auth')
const matchStatus = require('../helpers/matchStatus')
const router = new express.Router()


router.get('/challenge/:opponentId', ensureAuthenticated, async (req, res) => {
    const opponent = await PlayerService.getPlayer(req.params.opponentId)
    if (req.user._id.equals(opponent._id)) {
        req.flash('error', "You can't challenge yourself!")
        return res.redirect('/')
    }
    res.render('challenge.hbs', { opponent })
})

router.post('/challenge', ensureAuthenticated, async (req, res) => {
    let opponentId = req.body.opponentId
    let contract = req.body
    let playerId = req.user.id
    let newContract = await ContractService.createContract(contract, playerId)
    if (newContract.status != 200) {
        req.flash('error', newContract.data)
        return res.redirect('/challenge/' + opponentId)
    }
    req.flash('success_msg', 'Your challenge has been submitted to your opponent for review')
    res.redirect('/')
})

router.get('/contracts/outgoing', ensureAuthenticated, async (req, res) => {
    let allContracts = await Promise.all(await ContractService.getContractsByPlayerId(req.user.id))
    let contracts = allContracts.filter((contract) => {
        return (contract.playerId == req.user.id && contract.status == 1)
    }).map((contract) => {
        contract['currentStatus'] = matchStatus.statusToString(contract.status)
        return contract
    })
    let note = '*All contracts you see here are waiting to be Accepted or Declined by your opponent'
    res.render('contracts-accepted', { title: 'Sent Contracts', contracts, note })
})

router.get('/contracts/incoming', ensureAuthenticated, async (req, res) => {
    let allContracts = await Promise.all(await ContractService.getContractsByPlayerId(req.user.id))
    let contracts = allContracts.filter((contract) => {
        return (contract.playerId != req.user.id && contract.status == 1)
    }).map((contract) => {
        contract['currentStatus'] = matchStatus.statusToString(contract.status)
        return contract
    })
    let note = '*All contracts you see here are waiting to be Accepted or Declined by YOU'
    res.render('contracts-accepted', { title: 'Received Contracts', contracts, note })
})

router.get('/contracts/upcoming', ensureAuthenticated, async (req, res) => {
    let allContracts = await Promise.all(await ContractService.getContractsByPlayerId(req.user.id))
    let contracts = allContracts.filter((contract) => {
        return (contract.status == 2)
    }).map((contract) => {
        contract['currentStatus'] = matchStatus.statusToString(contract.status)
        return contract
    })
    let note = '*All contracts you see here have been accepted by you and the opponent. Make sure you print the match contract and bring it with you to the match'
    res.render('contracts-accepted', { title: 'All Upcoming Matches', contracts, note })
})

router.get('/contracts/cancelled-declined', ensureAuthenticated, async (req, res) => {
    let allContracts = await Promise.all(await ContractService.getContractsByPlayerId(req.user.id))
    let contracts = allContracts.filter((contract) => {
        return (contract.status == 3 || contract.status == 5)
    }).map((contract) => {
        contract['currentStatus'] = matchStatus.statusToString(contract.status)
        return contract
    })
    res.render('contracts-cancelled-declined', { title: 'Cancelled / Declined Matches', contracts })
})

router.get('/contract-review/:id', ensureAuthenticated, async (req, res) => {
    let contract = await ContractService.getContractByContractId(req.params.id)
    if (contract.status === 200) {
        contract = contract.data
        if (contract.opponentId == req.user.id) {
            opponent = await PlayerService.getPlayer(contract.playerId)
            contract['opponent'] = opponent
        }
        //pending-1, accepted-2, declined-3, cancelled-5
        if (contract.status == 2) {
            return res.render('contract-details', { contract })
        }
        if (contract.status == 1 && contract.opponentId == req.user.id) {
            return res.render('contract-incoming', { contract })
        }
        if (contract.status == 1 && contract.opponentId != req.user.id) {
            return res.render('contract-outgoing', { contract })
        }
        if (contract.status == 5 || contract.status == 3) {
            // declined contracts use the same page as outgoing because structure of web page is similar
            return res.render('contract-outgoing', { contract })
        }
    }
    req.flash('error', 'Something went wrong')
    return res.redirect('/')
})

router.post('/contract/status/:id', ensureAuthenticated, async (req, res) => {
    let contractId = req.params.id
    let status = req.body
    let player = req.user.id
    let updated = await ContractService.updateContract(contractId, status, player)

    if (updated.status == 200) {
        req.flash('success_msg', (updated.data.status == 2 ? 'Accepted: Check your Match History' : 'Declined'))
        return res.redirect('/')
    }
    req.flash('error', updated.data)
    return res.redirect('/')
})


router.get('/print-contract-pdf/:id', async (req, res) => {
    let contract = await ContractService.getContractByContractId(req.params.id)
    if (contract.status === 200) {
        contract = contract.data
        res.render('print-contract-pdf', { contract })
    }
})

router.get('/contract-get-pdf/:id', ensureAuthenticated, async (req, res) => {
    let contractId = req.params.id
    const puppeteerPDF = async (contractId) => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('http://localhost:8000/print-contract-pdf/' + contractId, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();
        return pdf
    }

    await puppeteerPDF(contractId).then(pdf => {
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
        res.send(pdf)
    }).catch((e) => {
        req.flash('error', 'Something went wrong with the PDF doc')
        res.redirect('/')
    })
})

module.exports = router