const express = require('express')
const path = require('../path')
const passport = require('passport');
const multipart = require('connect-multiparty')


const { ensureAuthenticated } = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const getPlayers = require('../services/player/getPlayers')
const registerPlayer = require('../services/player/registerPlayer')
const deletePlayer = require('../services/player/deletePlayer')

const router = new express.Router()
router.use("/avatar-pictures", express.static(path.PUBLIC.AVATAR_PICTURES))

router.get('/', async (req, res) => {
    let players = await getPlayers.getPlayers()
    res.render('main', { players });
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
    res.render('about.hbs')
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

// router.post("/login", function (req, res, next) {
//     console.log('HELLO')
//     passport.authenticate("local", function (err, player, info) {
//         if (err) { return next(err); }
//         if (!player) { return res.render('login', { error: info.message }) }
//         req.logIn(player, function (err) {
//             if (err) { return next(err); }
//             return res.redirect('/players/' + player._id);
//         })
//     })(req, res, next)
// })

router.post("/login", function (req, res, next) {
    console.log(req.body)
    passport.authenticate("local", function (err, player, info) {
        console.log(0)
        if (err) { 
            console.log("Error0", errs)
            return res.json({err}); 
        }
        if (!player) { 
            console.log("Error1",info.message)
            return res.json({error: info.message }) }
        req.logIn(player, function (err) {
            console.log(player)
            if (err) { 
                console.log("Error2",err)
                return next(err); 
            }
            return res.json({player});
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
    let delPlayer = await deletePlayer.deletePlayerById(req.params.id)
    if(delPlayer.status === 200){
        req.flash('success_msg', delPlayer.data);
        return res.redirect('/')
    }
    req.flash('error', delPlayer.data)
    res.redirect('/')   
})

module.exports = router