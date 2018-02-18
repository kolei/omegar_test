/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const passport = require('passport'),
      nodemailer = require('nodemailer'),
      crypto = require('crypto');

module.exports = {

  create: function (req, res) {
    let elem = {
      email: req.param('email'),
      username: req.param('username'),
      password: req.param('password')
    };

    User.create(elem).exec(function (err, user) {
      if (err){ 
        sails.log.debug('UserController.create error: %s', err);
        res.json(400, err); 
      }
      else
        res.json(200, user);
    });
  },
  
  update: function (req, res) {
    let id = req.user.id;
  
    sails.log.debug('UserController.update id: %s', id);

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
        if (err) return res.json(400,err);
        return res.ok();
      });
    });
  },
  
  login: function(req, res){
    sails.log.debug('UserController.login...');
    passport.authenticate('local', function(err, user, info){
      if(err || !user){
        // sails.log('AuthController.login auth error: %s', err);
        //Unauthorized
        return res.json(401, err);
      }
      req.logIn(user, function(err){
        if(err) {
          // sails.log('AuthController.login login error: %s', err);
          return res.json(401, err);
        }
        return res.json(user);
      });
    })(req, res);
  },

  logout: function (req,res){
    req.logout();
    res.json('logout successful');
  },
  
  forgotPassword: function(req, res){
    sails.log.debug('UserController.forgotPassword...');
    let email = req.param('email');
    if(email){
      User.findOne({email}, function(err, user) {
        if(err) return res.json(400, err);
        if(user){
          sails.log.debug('UserController.forgotPassword found user: %j', user);
          
          let activateCode;

          //в тестовом режиме используем константу
          if(sails.config.testActivateCode) activateCode = sails.config.testActivateCode;
          else activateCode = crypto.createHash('md5').update( (new Date()).toString() ).digest("hex"); 

          User.update(user.id, {activateCode}).exec((err, userU)=>{
            if(err) return res.json(400, err);

            if(sails.config.testActivateCode) return res.ok();
            else{
              if(sails.config.smtp){
                sails.log.debug('has smtp: %j', sails.config.smtp);
    
                let transport = nodemailer.createTransport(sails.config.smtp.transport);
                
                // setup email data with unicode symbols
                let mailOptions = {
                  from: sails.config.smtp.from,
                  to: email,
                  subject: 'Activation code',
                  text: 'You activation code: '+activateCode, 
                };
                
                // send mail with defined transport object
                transport.sendMail(mailOptions, (error, info) => {
                  transport.close();
                  if (error) {
                    sails.log.debug('UserController.forgotPassword sendMail error: %s', error);
                    return res.json(400, error);
                  }
                  return res.ok();
                });
              }
              else
                return res.json(400, 'No smpt settings');
            }
          });
        }
        else
          return res.json(400, 'Account not found');       
      });
    }
  },

  activate: function(req, res){
    sails.log.debug('UserController.activate...');
    let email = req.param('email'),
        activateCode = req.param('activateCode'),
        password = req.param('password');

    User.findOne({email}, function(err, user) {
      if(err) return res.json(400, err);
      if(user){
        sails.log.debug('UserController.activate found user: %j', user);
        if(activateCode==user.activateCode){
          User.update(user.id, {password}, function(err2, user2){
            if(err2) res.json(400, err);
            res.ok();
          });
        }
        else
          res.json(400, 'Bad activate code');
      }
      else
        return res.json(400, 'Account not found');       
    });        
  }
};

