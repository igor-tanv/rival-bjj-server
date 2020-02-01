const express = require('express')
const sharp = require('sharp')
const Player = require('../models/player')
const { ensureAuthenticated } = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const passport = require('passport');
const upload = require('../middleware/multer')
const router = new express.Router()


router.get('/', async (req, res) => {
    Player.find(function (err, players) {
       // Convert player avatar to base64 String
       players.forEach((player) => {
           player.avatar = player.avatar.toString('base64')
       })
        //sort by nogiRank from high to low
        players.sort((a, b) => b.nogi - a.nogi)
        res.render('main.hbs', {
            players,
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


router.post('/register', upload.single('avatar'),  async (req, res) => {
    
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 150, height: 150 }).png().toBuffer()
        req.body.avatar = buffer
        const player = new Player(req.body)
        await player.save()
        //sendWelcomeEmail(player.email, player.name)
        res.render('player-profile.hbs', { player })
    } catch (e) {
        req.flash('error', 'Something went wrong')
        res.redirect('/')
    }
})

router.get('/logout', function(req, res){
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

//playerProfile
router.get('/players/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id)
        res.render('player-profile.hbs', { player })
    } catch (e) {
        res.redirect('/login')
    }
})

//Opponent Profile
router.get('/players/opponent/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id)
        if (!player) { throw new Error() }
        res.render('opponent-profile.hbs', { player })
    } catch (e) {
        res.status(404).send()
    }
})



module.exports = router