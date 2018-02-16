/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const passport = require('passport');

module.exports = {
/**
+регистрация нового пользователя (email, username, пароль).
+авторизация пользователя (email, пароль).
смена (восстановление) пароля - послать мыло с кодом авторизации
+смена username;
  загрузка аватарки.
*/
  create: function (req, res) {
    let elem = {
      email: req.param('email'),
      username: req.param('username'),
      password: req.param('password')
    };

    User.create(elem).exec(function (err, user) {
      if (err){ 
        sails.log('UserController.create error: %s', err);
        res.send(400, err); 
      }
      else{
        // if(sails.config.user.requireUserActivation){
        //   var emailTemplate = res.render('email/email.ejs', {user: user}, function(err, list){  

        //     nodemailer.send({
        //       name:       user.firstName + ' ' + user.lastName,
        //       from:       sails.config.nodemailer.from,
        //       to:         user.email,
        //       subject:       'New Account Acivation Required',
        //       messageHtml: list
        //     }, function(err, response){
        //       sails.log.debug('nodemailer sent', err, response);
        //     });
        //     res.send(200, user);

        //   });
        // }else
          res.json(200, user);
      }
    });
  },
  
  update: function (req, res) {
    let id = req.user.id;
  
    sails.log('UserController.update id: %s', id);

    let elem = {};

    //update only supported fields
    if(req.param('email')) elem.email = req.param('email');
    if(req.param('username')) elem.username = req.param('username');
    if(req.param('password')) elem.password = req.param('password');
  
    User.update(id, elem).exec(function(err, user) {
      if(err) return res.json(400, err);
      res.json(user);
    });
  
  },
  
  uploadAvatar: function (req, res) {
    sails.log('UserController.uploadAvatar');
    req.file('avatar').upload({
      // don't allow the total upload size to exceed ~1MB
      maxBytes: 1000000
    },function whenDone(err, uploadedFiles) {
      if(err){
        return res.json(400, err);
      }
  
      // If no files were uploaded, respond with an error.
      if(uploadedFiles.length === 0)
        return res.badRequest('No file was uploaded');
  
      // Save the "fd" and the url where the avatar for a user can be accessed
      User.update(req.user.id, {
  
        // Generate a unique URL where the avatar can be downloaded.
        avatarUrl: require('util').format('%s/user/avatar/%s', sails.config.appUrl, req.user.id),
  
        // Grab the first file and use it's `fd` (file descriptor)
        avatarFd: uploadedFiles[0].fd
      })
      .exec(function (err){
        if (err) return res.negotiate(err);
        return res.ok();
      });
    });
  },
  
  login: function(req, res){
    passport.authenticate('local', function(err, user, info){
      if(err || !user){
        // sails.log('AuthController.login auth error: %s', err);
        //Unauthorized
        return res.json(401, err);
      }
      req.logIn(user, function(err){
        if(err) {
          // sails.log('AuthController.login login error: %s', err);
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

