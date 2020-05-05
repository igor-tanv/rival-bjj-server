const express = require('express')
const path = require('../path')
const passport = require('passport');
const multipart = require('connect-multiparty')
const fs = require('fs')

const { ensureAuthenticated } = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const PlayerService = require('../services/player/index')
const ContractService = require('../services/contract/index')
const ChatService = require('../services/chat/index')

const router = new express.Router()

router.use("/avatar-pictures", express.static(path.PUBLIC.AVATAR_PICTURES))
router.use("/css", express.static(path.PUBLIC.CSS))

router.get('/', async (req, res) => {
    let players = await PlayerService.getPlayers()
    players.forEach((player) => {
        player.gi = undefined
    })
    players.sort((a, b) => b.nogi - a.nogi)
    res.render('main', { players });
})

router.get('/chat/:opponentId', ensureAuthenticated, async (req, res) => {
    let opponentId = req.params.opponentId
    let playerId = req.user.id
    if (opponentId == playerId) {
        req.flash('error', "You can't open a chat with yourself")
        return res.redirect('/')
    }
    let chat = await ChatService.getChat(opponentId, playerId)
    if (!chat) {
        let newChat = await ChatService.createChat(opponentId, playerId)
        return res.render('chat', { opponent: newChat.opponent, messages: newChat.messages, chatId: newChat.id })
    }
    res.render('chat', { opponent: chat.opponent, messages: chat.messages, chatId: chat.id });
})

router.post('/chat', ensureAuthenticated, async (req, res) => {
    let playerId = req.user.id
    let chatId = req.body.chatId
    let message = {
        from: playerId,
        text: req.body.messageInput
    }
    let chat = await ChatService.updateChat(chatId, message, playerId)
    res.render('chat', { opponent: chat.opponent, messages: chat.messages, chatId });
})

router.post('/sort-by', async (req, res) => {
    let players = await PlayerService.getPlayers()
    let style = req.body.status
    let weight = req.body.weightClass
    if (style == 'null' || weight == 'null') {
        req.flash('error', 'Search Error: Select Gi or NoGi AND a weightclass')
        return res.redirect('/')
    }
    if (weight != 'Absolute') {
        players = players.filter((player) => {
            return player.weightClass == weight
        })
    }
    if (style == 'gi') {
        players.forEach((player) => {
            player.nogi = undefined
        })
    } else if (style == 'nogi') {
        players.forEach((player) => {
            player.gi = undefined
        })
    }
    players.sort((a, b) => b[style] - a[style])
    style = style.toUpperCase()
    res.render('main', { players, style, weight });
})

router.post("/register", multipart({ uploadDir: path.PUBLIC.AVATAR_PICTURES, maxFieldsSize: 10 * 1024 * 1024 }), async (req, res) => {
    const registerData = await PlayerService.registerPlayer(req.body, req.files.avatar)
    if (registerData.status != 200) {
        return res.render("register", { error: registerData.data })
    }
    let player = registerData.data
    //factor out this code and the same in the post login 
    req.logIn(player, function (err) {
        if (err) { return next(err); }
        return res.redirect('/players/' + player._id);
    })
})

router.get('/about', async (req, res) => {
    res.render('about')
})

router.get('/rules', async (req, res) => {
    res.render('rules')
})

router.get('/register', async (req, res) => {
    res.render('register.hbs')
})

router.get('/logout', function (req, res) {
    req.flash('success_msg', 'You have logged out of your account');
    req.logout();
    res.redirect('/');
});

router.get('/login', async (req, res) => {
    res.render('login.hbs')
})

router.post("/login", function (req, res, next) {
    passport.authenticate("local", function (err, player, info) {
        if (err) { return next(err); }
        if (!player) { return res.render('login', { error: info.message }) }
        req.logIn(player, function (err) {
            if (err) { return next(err); }
            return res.redirect('/players/' + player._id);
        })
    })(req, res, next)
})

router.get('/players/:id', ensureAuthenticated, async (req, res) => {
        let player = (req.params.id === ":id") ? await PlayerService.getPlayer(req.user.id) : await PlayerService.getPlayer(req.params.id)
        let contracts = await Promise.all(await ContractService.getMatchHistory(player.id))
        res.render('player-profile', { player, contracts })
})

router.get('/players/opponent/:id', async (req, res) => {
    try {
        const player = await PlayerService.getPlayer(req.params.id)
        if (!player) {
            req.flash('error', 'That player does not exist')
            return res.redirect('/')
        }
        let contracts = await Promise.all(await ContractService.getMatchHistory(player.id))
        res.render('opponent-profile.hbs', { player, contracts })
    } catch (e) {
        req.flash('error', 'Something went wrong')
        res.redirect('/')
    }
})

router.post('/player/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        let player = await PlayerService.deletePlayerById(req.params.id)
        fs.unlink(path.PUBLIC.AVATAR_PICTURES + '/' + player.data.avatar, function (err) {
            if (err) throw err
        })
        if (player.status === 200) {
            req.flash('success_msg', 'Your account has been deleted');
            return res.redirect('/')
        }
    } catch (e) {
        req.flash('error', 'Error while deleting profile')
        res.redirect('/')
    }


})

module.exports = router