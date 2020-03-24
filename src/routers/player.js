const express = require('express')
const Player = require('../models/player')
const { ensureAuthenticated } = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const passport = require('passport');
const upload = require('../middleware/multer')
const router = new express.Router()
const path = require('../path')
router.use('/players/avatars', express.static(path.PUBLIC.AVATAR_PICTURES))
const multerParams = upload.single('avatar')
var ObjectId = require('mongoose').Types.ObjectId;


//new structure
const getPlayers = require('../services/player/getPlayers')
const registerPlayer = require('../services/player/registerPlayer')
let multipart = require('connect-multiparty')


// router.post('/register', async (req, res) => {
//     console.log('REQ.BODY', req.body)
//     console.log('REQ.FILES', req.files)
//     //need req.body and req.avatar
//     multipart({ uploadDir: path.PUBLIC.AVATAR_PICTURES, maxFieldsSize: 10 * 1024 * 1024 })
//     const player = await registerPlayer.registerPlayer(req.body, req.files)
//     console.log('API', player)
//     if (player.status != 200) {
//         req.flash('error', 'Registration Error')
//         return res.redirect('/register')
//     }
// })

router.post('/register', async (req,res) => {
    console.log(req.body)
})


router.get('/', async (req, res) => {
    let players = await getPlayers.getPlayers()
    res.render('main.hbs', { players });
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
router.get('/players/:id', ensureAuthenticated, async (req, res) => {
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