/**
 * LikeController
 *
 * @description :: Server-side logic for managing messages likes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
  
  create: function (req, res) {
    let elem = {
      message: req.param('message'),
      owner: req.user.id,
    };
  
    Like.findOrCreate(elem, elem, function (err,message) {
      res.ok();
    });
  },

  delete: function(req, res){
    let messageId = req.param('message');
    Like.destroy({message: messageId, owner:req.user.id}).exec((err, deletedRecords)=>{
      res.ok();
    });
  },
}
