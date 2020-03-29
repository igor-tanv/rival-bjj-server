module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error', 'You must log in to view that page');
      res.redirect('/login');
    },
  };

  