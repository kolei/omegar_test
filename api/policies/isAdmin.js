/**
* Allow only admin
*/
module.exports = function(req, res, next){
  if(req.user && req.user.email=='kolei@yandex.ru') return next();
  else return res.json(403, { message: 'Not Authorized' });
}