/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 *                 Anyone can view the messages. Authorized users can create new messages 
 *                 and edit or delete their messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/**
 * Helper function: calc "like" count for message
 * @param {string} {messageId} Message Id
 * @returns {Integer} Likes count
 */
async function getLikes(messageId){
  return new Promise((resolve, reject)=>{
    Like.count({message: messageId}).exec((err, count)=>{
      if(err) resolve(0);
      else resolve(count);
    });
  });
}

module.exports = {
    /**
     * Method called on post /message/:theme
     * @param {string} {theme} Theme id for message
     * @param {string} {title} Message title
     * @param {text} {body} Message body
     */
    create: function (req, res) {
      //validate request params
      try{
        req.validate({
          theme: 'string',
          title: 'string',
          body: 'string',
        });
      }catch(err){
        sails.log.debug(err);
        return res.json(400, {error:'bad params'});
      }

      let elem = {
        themeId: req.param('theme'),
        title: req.param('title'),
        body: req.param('body'),
        owner: req.user.id
      };
  
      //Create message
      Message.create(elem).exec(function (err,message) {
        if (err){ 
          sails.log.debug('MessageController.create error: %s', err);
          return res.json(400, {error:err}); 
        }
        else
        return res.json(200, message);
      });
    },

    /**
     * Find single message by id
     * @param {string} {id} Message id
     */
    findOne: function(req, res){
      //validate request params
      try{
        req.validate({
          id: 'string',
        });
      }catch(err){
        sails.log.debug(err);
        return res.json(400, {error:'bad params'});
      }

      //find message 
      Message.findOne({id: req.param('id')})
        .populate('owner')  // add owner data
        .exec(async(err, message)=>{
          if(err) return res.json(400, {error:err});
          try{
            //calc likes 
            message.likes = await getLikes(message.id);
          }catch(e){
            //
          }
          return res.json(200, message);
        });
    },

    /**
     * Find messages in theme with pagination
     * @param {string} {theme} Theme id
     * @param {integer} {from} Skip records
     * @param {integer} {limit} Messages on page (optional,  default 20 items)
     */
    find: function(req, res){
      //validate request params
      try{
        req.validate({
          theme: 'string',
          from: 'integer',
        });
      }catch(err){
        sails.log.debug(err);
        return res.json(400, {error:'bad params'});
      }
      
      let skip = (req.param('from') || 1)-1,
          limit = req.param('limit') || 20,
          themeId = req.param('theme');

      //Find messages with skip and limit 
      Message.find({skip,limit})
        .where({themeId}) //filter by theme id
        .populate('owner') //add owner data
        .exec(async(err, list)=>{
          if (err){ 
            sails.log.debug('MessageController.find error: %s', err);
            return res.json(400, {error:err}); 
          }
          else{
            try{
              //for each message calc likes count
              for(let i=0;i<list.length;i++)
                list[i].likes = await getLikes(list[i].id);
            }catch(e){
              //
            }
            return res.json(200, list);
          }
        });
    },
  
    /**
     * Delete message by id
     * @param {string} {id} Message id
     */
    delete: function(req, res){
      //validate request params
      try{
        req.validate({
          id: 'string',
        });
      }catch(err){
        sails.log.debug(err);
        return res.json(400, {error:'bad params'});
      }

      let messageId = req.param('id');

      //find message
      Message.findOne({id:messageId}).exec((err, message)=>{
        if(err){
          sails.log.debug('MessageController.delete DB error: %s', err);
          res.json(400, {error:err}); 
        }
        else{
          if(message){
            //if has message ans user is owner
            if(message.owner==req.user.id){
              Message.destroy({id: messageId}).exec((err2, deletedRecords)=>{
                if(err2) return res.json(400, {error:err2});
                else return res.ok();
              });
            }
            else{
              return res.json(403, {error:'Only owner can delete message'});
            }
          }
          else
            return res.json(404, {error:'Message not found'});
        }
      });
    },
  
    /**
     * Update message title or body
     * @param {string} {id} Message id
     * @param {string} {title} Message title (optional)
     * @param {text} {body} Message body (optional)
     */
    update: function(req, res){
      //validate request params
      try{
        req.validate({
          id: 'string',
        });
      }catch(err){
        sails.log.debug(err);
        return res.json(400, 'bad params');
      }

      let messageId = req.param('id'),
          elem = {};

      if(req.param('title')) elem.title = req.param('title');
      if(req.param('body')) elem.body = req.param('body');

      //update message with owner filter
      Message.update({id:messageId, owner:req.user.id}, elem).exec((err, message)=>{
        if(err) return res.json(400, {error:err});

        if(message.length==0) return res.json(403, {error:'not owner'});
        else return res.ok();
      });
    },
  }
  