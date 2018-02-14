/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
/**
регистрация нового пользователя (email, username, пароль).
авторизация пользователя (email, пароль).
смена (восстановление) пароля.
смена username;
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
        console.log('UserController.create error: %s', err);
        res.send(500, err); 
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
  }	
};

