/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const passport = require('passport');

module.exports = {
	auth: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if(err || !user){
        return res.json(400, {
          message: 'login failed'
        });
        //res.send(err);
      }
      req.logIn(user, function(err) {
        if(err) res.json(400, err);
        return res.ok();
     });
    })(req, res);
  }
};

