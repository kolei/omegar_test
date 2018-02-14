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
      if(err) return res.json(400, err);
      req.session.auth = true;

      sails.log('User.create: %j', user);

      res.json(user);
    });
  }	
};

