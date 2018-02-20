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
  /**
   * Method for create user
   * @param {string} {email} User email (unique)
   * @param {string} {username} User name
   * @param {string} {password}
   */
  create: function (req, res) {
    //validate request params
    try{
      req.validate({
        email:    'email',
        username: 'string',
        password: 'string'
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, {error:'bad params'});
    }

    let elem = {
      email: req.param('email'),
      username: req.param('username'),
      password: req.param('password')
    };

    //try create
    User.create(elem).exec(function (err, user) {
      if (err){ 
        sails.log.debug('UserController.create error: %s', err);
        return res.json(400, {error:err}); 
      }
      else
        return res.json(200, user);
    });
  },
  
  /**
   * Update user email, username or password
   * @param {string} {email} Email (optional)
   * @param {string} {username} User name (optional)
   * @param {string} {password} password (optional)
   */
  update: function (req, res) {
    let id = req.user.id,
        elem = {};

    //update only supported fields
    if(req.param('email')) elem.email = req.param('email');
    if(req.param('username')) elem.username = req.param('username');
    if(req.param('password')) elem.password = req.param('password');
  
    //try update
    User.update(id, elem).exec(function(err, user) {
      if(err) return res.json(400, {error:err});
      return res.json(user);
    });
  
  },
  
  /**
   * Upload user avatar. File saved in assets/images with name userid.<ext>
   */
  uploadAvatar: function (req, res) {
    var fileName;
    //upload file
    req.file('avatar').upload({
      // don't allow the total upload size to exceed ~50k
      maxBytes: 50000,
      // set path and name
      saveAs: function(file, cb){
        let extension = file.filename.split('.').pop();
        fileName = req.user.id+'.'+extension;
        cb(null, require('path').resolve(sails.config.appPath, 'assets/images')+'/'+fileName);
      }
    },function whenDone(err, uploadedFiles) {
      if(err) return res.json(400, {error:err});

      // If no files were uploaded, respond with an error.
      if(uploadedFiles.length === 0)
        return res.json(400, {error:'No file was uploaded'});

      //save avatar url in user  
      User.update(req.user.id, {
        // Generate a unique URL where the avatar can be downloaded.
        avatarUrl: require('util').format('%s/images/%s', sails.getBaseurl(), fileName),
      })
      .exec(function (err, user){
        if (err) return res.json(400, {error:err});
        return res.ok();
      });
    });
  },
  
  /**
   * Login user
   * @param {email} {email} User email
   * @param {string} {password} User password
   */
  login: function(req, res){
    //validate request params
    try{
      req.validate({
        email:    'email',
        password: 'string'
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, {error:'bad params'});
    }
    
    //try authenticate
    passport.authenticate('local', function(err, user, info){
      if(err || !user){
        //Unauthorized
        return res.json(401, {error:err});
      }
      req.logIn(user, function(err){
        if(err) return res.json(401, {error:err});
        return res.json(200, user);
      });
    })(req, res);
  },

  /**
   * Logout user
   */
  logout: function (req,res){
    req.logout();
    return res.ok();
  },
  
  /**
   * Forgotten password recovery. 
   * The authorization code is sent to the user's email. The code is saved in the database
   * @param {email} {email} User email
   */
  forgotPassword: function(req, res){
    //validate request params
    try{
      req.validate({
        email:    'email',
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, {error:'bad params'});
    }

    let email = req.param('email');

    //try find user
    User.findOne({email}, function(err, user) {
      if(err) return res.json(400, {error:err});
      if(user){
        sails.log.debug('UserController.forgotPassword found user: %j', user);
          
        let activateCode;

        //in test mode use testActivateCode
        if(sails.config.testActivateCode) activateCode = sails.config.testActivateCode;
        else 
          //else make random code
          activateCode = crypto.createHash('md5').update( (new Date()).toString() ).digest("hex"); 

        //save code in database  
        User.update(user.id, {activateCode}).exec((err, userU)=>{
          if(err) return res.json(400, {error:err});

          if(sails.config.testActivateCode) return res.ok();
          else{
            //try send email use nodemailer
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
                  return res.json(400, {error});
                }
                return res.ok();
              });
            }
            else
              return res.json(400, {error:'No smpt settings'});
          }
        });
      }
      else
        return res.json(404, {error:'Account not found'});       
    });
  },

  /**
   * Activate user by code (forgot password finalization)
   * @param {email} {email} User email
   * @param {string} {activateCode} Activate code
   * @param {string} {password} New password
   */
  activate: function(req, res){
    //validate request params
    try{
      req.validate({
        email:    'email',
        activateCode: 'string',
        password: 'string'
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, {error:'bad params'});
    }

    let email = req.param('email'),
        activateCode = req.param('activateCode'),
        password = req.param('password');

    //find user by email
    User.findOne({email}, function(err, user) {
      if(err) return res.json(400, {error:err});
      if(user){
        sails.log.debug('UserController.activate found user: %j', user);
        //if found and compatible activateCode then set new password
        if(activateCode==user.activateCode){
          User.update(user.id, {password}, function(err2, user2){
            if(err2) return res.json(400, {error:err2});
            return res.ok();
          });
        }
        else
          return res.json(400, {error:'Wrong activate code'});
      }
      else
        return res.json(404, {error:'Account not found'});
    });        
  }
};

