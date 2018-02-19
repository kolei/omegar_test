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
    try{
      req.validate({
        email:    'email',
        username: 'string',
        password: 'string'
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, 'bad params');
    }

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
    let id = req.user.id,
        elem = {};

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
    var fileName;

    req.file('avatar').upload({
      // don't allow the total upload size to exceed ~1MB
      maxBytes: 50000,
      //dirname: require('path').resolve(sails.config.appPath, 'assets/images'),
      saveAs: function(file, cb){
        let extension = file.filename.split('.').pop();
        fileName = req.user.id+'.'+extension;
        cb(null, require('path').resolve(sails.config.appPath, 'assets/images')+'/'+fileName);
      }
    },function whenDone(err, uploadedFiles) {
      if(err) return res.json(400, err);

      // If no files were uploaded, respond with an error.
      if(uploadedFiles.length === 0)
        return res.badRequest('No file was uploaded');

      //sails.log.debug('file name: %s', uploadedFiles[0]);  

      // Save the "fd" and the url where the avatar for a user can be accessed
      User.update(req.user.id, {
        // Generate a unique URL where the avatar can be downloaded.
        avatarUrl: require('util').format('%s/images/%s', sails.getBaseurl(), fileName),
      })
      .exec(function (err, user){
        if (err) return res.json(400,err);
        res.ok();
      });
    });
  },
  
  login: function(req, res){
    try{
      req.validate({
        email:    'email',
        password: 'string'
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, 'bad params');
    }
    
    passport.authenticate('local', function(err, user, info){
      if(err || !user){
        //Unauthorized
        return res.json(401, err);
      }
      req.logIn(user, function(err){
        if(err) return res.json(401, err);
        return res.json(user);
      });
    })(req, res);
  },

  logout: function (req,res){
    req.logout();
    return res.json('logout successful');
  },
  
  forgotPassword: function(req, res){
    try{
      req.validate({
        email:    'email',
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, 'bad params');
    }

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
    try{
      req.validate({
        email:    'email',
        activateCode: 'string',
        password: 'string'
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, 'bad params');
    }

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

