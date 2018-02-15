/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const passport = require('passport');

module.exports = {
  login: function(req, res){
    sails.log('AuthController.login');
    passport.authenticate('local', function(err, user, info){
      if(err || !user){
        sails.log('AuthController.login auth error: %s', err);
        //Unauthorized
        return res.json(401, err);
      }
      req.logIn(user, function(err){
        if(err) {
          sails.log('AuthController.login login error: %s', err);
          res.json(401, err);
        }
        return res.json(user);
      });
    })(req, res);
  },
  logout: function (req,res){
    req.logout();
    res.json('logout successful');
  }
};

