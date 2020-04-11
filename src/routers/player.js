const express = require('express')
const path = require('../path')
const passport = require('passport');
const multipart = require('connect-multiparty')
const fs = require('fs')

const { ensureAuthenticated } = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const getPlayers = require('../services/player/getPlayers')
const registerPlayer = require('../services/player/registerPlayer')
const deletePlayerById = require('../services/player/deletePlayerById')

const router = new express.Router()
router.use("/avatar-pictures", express.static(path.PUBLIC.AVATAR_PICTURES))

router.get('/', async (req, res) => {
    let players = await getPlayers.getPlayers()
    players.forEach((player) =>{
        player.gi = undefined
    }) 
    players.sort((a, b) => b.nogi - a.nogi)
    res.render('main', { players });
})

router.post('/sort-by', async(req, res) => {
    let players = await getPlayers.getPlayers()
    let style = req.body.status
    let weight = req.body.weightClass
    if (style == 'null' || weight == 'null') {
        req.flash('error', 'Search Error: You must select a category AND a weightclass')
        return res.redirect('/')
    }
    if (weight != 'Absolute') {
        players = players.filter((player) => {
            return player.weightClass == weight
        })
    } 
    if(style == 'gi'){
        players.forEach((player) =>{
            player.nogi = undefined
        })
    } else if (style == 'nogi'){
        players.forEach((player) =>{
            player.gi = undefined
        }) 
    }
    players.sort((a, b) => b[style] - a[style])
    style = style.toUpperCase()
    res.render('main', { players, style, weight });
})

router.post("/register", multipart({ uploadDir: path.PUBLIC.AVATAR_PICTURES, maxFieldsSize: 10 * 1024 * 1024 }), async (req, res) => {
    const registerData = await registerPlayer.registerPlayer(req.body, req.files.avatar)
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
    try {
        let player = (req.params.id === ":id") ? await getPlayers.getPlayer(req.user.id) : await getPlayers.getPlayer(req.params.id)
        res.render('player-profile', { player })
    } catch (e) {
        req.flash('error', 'Login to view your profile')
        res.redirect('login')
    }
})

router.get('/players/opponent/:id', async (req, res) => {
    try {
        const player = await getPlayers.getPlayer(req.params.id)
        if (!player) {
            req.flash('error', 'That player does not exist')
            return res.redirect('/')
        }
        res.render('opponent-profile.hbs', { player })
    } catch (e) {
        req.flash('error', 'Something went wrong')
        res.redirect('/')
    }
})

router.post('/player/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        let player = await deletePlayerById.deletePlayerById(req.params.id)
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