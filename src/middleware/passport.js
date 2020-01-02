const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load Player model
const Player = require('../models/player');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match player
      Player.findOne({
        email: email
      }).then(player => {
        if (!player) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, player.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, player);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(player, done) {
    done(null, player.id);
  });

  passport.deserializeUser(function(id, done) {
    Player.findById(id, function(err, player) {
      done(err, player);
    });
  });
};