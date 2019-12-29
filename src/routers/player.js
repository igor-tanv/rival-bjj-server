const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Player = require('../models/player')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()


router.get('/', async (req, res) => {

    Player.find(function(err, rank) {
        //sorts by nogiRank from high to low
        rank.sort((a,b) => b.nogi - a.nogi)
        res.render('main', { 
            title: 'Welcome to Rival',
            rankings: rank });
    });
    
})

router.get('/about', async (req, res) => {

    res.render('about', {
        title: 'About Rival',
        name: 'Igor Tatarinov'
    })
})

router.get('/challenge', async (req, res) => {

    res.render('challenge', {
        title: 'The Match Contract'
    })

})


router.get('/register', async (req, res) => {

    res.render('register', {
        title: 'Register Your BJJ Profile',
        name: 'Igor Tatarinov'
    })

})


router.post('/signed_up', async (req, res) => {
    
    const player = new Player(req.body)
    console.log(player)
    
    try {
        await player.save()
        //sendWelcomeEmail(player.email, player.name)
        //const token = await player.generateAuthToken()
        res.render('playerProfile', {
            first: player.firstName,
            last: player.lastName,
            school: player.school,
            gi: player.gi,
            nogi: player.nogi,
            weight: player.weight
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/login', async (req, res) => {

    res.render('login', {
        title: 'Login to Your Profile'
    })
})

router.post('/players/me', async (req, res) => {
    
    try {
        const player = await Player.findByCredentials(req.body.email, req.body.password)
        const token = await player.generateAuthToken()
        //res.send({ player, token }) 
        res.render('playerProfile', {
            id: player._id,
            first: player.firstName,
            last: player.lastName,
            school: player.school,
            gi: player.gi,
            nogi: player.nogi,
            weight: player.weight
        })
    } catch (e) {
        res.redirect('/login')
    }
})

router.get('/players/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id)
        if (!player) { throw new Error() }
        res.render('opponentProfile', {player})
    } catch (e) {
        res.status(404).send()
    }
})



module.exports = router