/**
 * LikeController
 *
 * @description :: Server-side logic for managing messages likes
 *                 Authorized users can like/dislike messages, one user counts only one vote 
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
  /**
   * Like message
   * @param {string} {message} Message id
   */
  create: function (req, res) {
    try{
      req.validate({
        message: 'string',
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, {error:'bad params'});
    }

    let elem = {
      message: req.param('message'),
      owner: req.user.id,
    };

    //Creates an entry if the "like" does not yet exist
    Like.findOrCreate(elem, elem, function (err) {
      res.ok();
    });
  },

  /**
   * Dislike message
   * @param {string} {message} Message id
   */
  delete: function(req, res){
    try{
      req.validate({
        message: 'string',
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, {error:'bad params'});
    }
    //Delete an entry if the "like" exist
    Like.destroy({message: req.param('message'), owner:req.user.id}).exec((err)=>{
      res.ok();
    });
  },
}
