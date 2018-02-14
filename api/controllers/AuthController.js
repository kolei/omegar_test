/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const passport = require('passport');

module.exports = {
  login: function(req, res){
    console.log('AuthController.login');
    passport.authenticate('local', function(err, user, info){
      if ((err) || (!user)){
        console.log('AuthController.login auth error: %s', err);
        res.send(err);
      }
      req.logIn(user, function(err){
        if (err) {
          console.log('AuthController.login login error: %s', err);
          res.send(err);
        }
        return res.send({ message: 'login successful' });
      });
    })(req, res);
  },
  logout: function (req,res){
    req.logout();
    res.send('logout successful');
  }
};

