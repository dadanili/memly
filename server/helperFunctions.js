module.exports = {
  isLoggedIn: function(req, res, next) {
    console.log('=============================I am hitting isLoggedIn helper function');
    if (!req.session.passport) {
      console.log('no passport session detected. sorry!!!');
      res.redirect('http://localhost:3000/#');
    } else if (!req.session.passport.user) {
      console.log('no passport user defined. maybe next time????');
      res.redirect('http://localhost:3000/#');
    } else {
      next();
    }
  }
};