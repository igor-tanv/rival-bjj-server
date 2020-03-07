const express = require('express')
const sharp = require('sharp')
const Player = require('../models/player')
const { ensureAuthenticated } = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const passport = require('passport');
const upload = require('../middleware/multer')
const router = new express.Router()
const multerParams = upload.single('avatar')
var ObjectId = require('mongoose').Types.ObjectId;
//import playersService from '../services/players' 
const playersService = require('../services/players')
let multipart = require('connect-multiparty')
const path = require('../path')

router.use('/players/avatars', express.static(path.PUBLIC.AVATAR_PICTURES))

// router.get('/', async (req, res) => {
//     console.log(req.body)
//     Player.find(function (err, players) {
        // Convert player avatar to base64 String
        // players.forEach((player) => {
        //     console.log(player.avatar.toString('base64'))
        //    player.avatar = player.avatar.toString('base64')
        // })
        
        //sort by nogiRank from high to low
//         players.sort((a, b) => b.nogi - a.nogi)
//         res.render('main.hbs', { players });
        
//     });
// })

router.get('/players', playersService.getPlayers)

router.get('/about', async (req, res) => {
    res.render('about.hbs', {
        title: 'About Rival',
    })
})

router.get('/register', async (req, res) => {
    console.log('GET ROUTE')
    res.render('register.hbs', {
        title: 'Register Your BJJ Profile',
    })
})

router.post('/register', multipart({uploadDir:path.PUBLIC.AVATAR_PICTURES, maxFieldsSize: 10 * 1024 *1024}), playersService.registerPlayer)

router.get('/logout', function (req, res) {
    req.flash('success_msg', 'You have logged out of your account');
    req.logout();
    res.redirect('/');
});

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

//Player Profile
router.get('/players/:id', async (req, res) => {
    try {
        let player = (req.params.id === ":id") ? await Player.findById(req.user.id) : await Player.findById(req.params.id)
        player.avatar = player.avatar.toString('base64')
        res.render('player-profile.hbs', { player })
    } catch (e) {
        req.flash('error', 'Login to view your profile')
        res.redirect('/login')
    }
})

//Opponent Profile
router.get('/players/opponent/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id)
        player.avatar = player.avatar.toString('base64')
        if (!player) { throw new Error() }
        res.render('opponent-profile.hbs', { player })
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router