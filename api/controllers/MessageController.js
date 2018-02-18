/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  
    create: function (req, res) {
      let elem = {
        themeId: req.param('theme'),
        title: req.param('title'),
        body: req.param('body'),
        owner: req.user.id
      };
  
      Message.create(elem).exec(function (err,message) {
        if (err){ 
          sails.log.debug('MessageController.create error: %s', err);
          res.json(400, err); 
        }
        else
          res.json(200, message);
      });
    },
  
    find: function(req, res){
      let skip = (req.param('from') || 1)-1,
          limit = req.param('limit') || 20;
  
      Message.find({skip,limit}).exec(function(err, list){
        if (err){ 
          sails.log.debug('MessageController.find error: %s', err);
          res.json(400, err); 
        }
        else
          res.json(200, list);
      });
    },
  
    delete: function(req, res){
      let messageId = req.param('id');
      Message.findOne({id:messageId}).exec((err, message)=>{
        if(err){
          sails.log.debug('MessageController.delete DB error: %s', err);
          res.json(400, err); 
        }
        else{
          if(message){
            if(message.owner==req.user.id){
              Message.destroy({id: messageId}).exec((err2, deletedRecords)=>{
                if(err2) res.json(400, err2);
                else res.ok();
              });
            }
            else{
              res.json(400, 'Only owner can delete message');
            }
          }
          else
            res.json(400, 'Message not found')
  
        }
      });
    },
  
    update: function(req, res){
      let messageId = req.param('id'),
          elem = {};

      if(req.param('title')) elem.title = req.param('title');
      if(req.param('body')) elem.body = req.param('body');

      Theme.update({id:messageId, owner:req.user.id}, elem).exec((err, message)=>{
        if(err2) res.json(400, err2);
        else res.ok();
      });
    },
  }
  