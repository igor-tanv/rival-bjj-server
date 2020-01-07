const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Player = require('../models/player')
//const auth = require('../middleware/auth')
const { ensureAuthenticated } = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const passport = require('passport');
const router = new express.Router()

router.get('/', async (req, res) => {
    Player.find(function (err, rank) {
        //sort by nogiRank from high to low
        rank.sort((a, b) => b.nogi - a.nogi)
        res.render('main.hbs', {
            title: 'Welcome to Rival',
            rankings: rank
        });
    });
})

router.get('/about', async (req, res) => {
    res.render('about.hbs', {
        title: 'About Rival',
    })
})

router.get('/register', async (req, res) => {
    res.render('register.hbs', {
        title: 'Register Your BJJ Profile',
    })
})

router.post('/register', async (req, res) => {
    try {
        const player = new Player(req.body)
        await player.save()
        //sendWelcomeEmail(player.email, player.name)
        res.render('playerProfile.hbs', { player })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/login', async (req, res) => {
    res.render('login.hbs', {
        title: 'Login to Your Profile'
    })
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

//playerProfile
router.get('/players/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id)
        res.render('playerProfile.hbs', { player })
    } catch (e) {
        res.redirect('/login')
    }
})

//Opponent Profile
router.get('/players/opponent/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id)
        if (!player) { throw new Error() }
        res.render('opponentProfile.hbs', { player })
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/challenge/:opponentId', ensureAuthenticated, async (req, res) => {
    const opponent = await Player.findById(req.params.opponentId)
    res.render('challenge.hbs', {
        title: 'The Match Contract',
        opponent
    })
})

module.exports = router