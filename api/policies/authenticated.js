/**
* Allow any authenticated user.
*/
module.exports = function(req, res, next){
  if (req.user){
    sails.log('authenticated.js user valid: %j', req.user);
    return next();
  }
  else 
    return res.json(403, { message: 'Not Authorized' });
}