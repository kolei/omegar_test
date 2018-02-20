/**
 * ThemeController
 *
 * @description :: Server-side logic for managing themes
 *                 Anyone can view the list of topics. Authorized users can create new topics, edit or delete their own
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * Method for create new theme
   * @param {string} {title} Theme title
   */
  create: function (req, res) {
    //validate request params
    try{
      req.validate({
        title: 'string',
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, {error:'bad params'});
    }

    let elem = {
      title: req.param('title'),
      owner: req.user.id
    };

    //create theme
    Theme.create(elem).exec(function (err, theme) {
      if (err){ 
        sails.log.debug('ThemeController.create error: %s', err);
        return res.json(400, {error:err}); 
      }
      else
        return res.json(200, theme);
    });
  },

  /**
   * Get themes list with pagination
   * @param {integer} {from} Skip records count (optional)
   * @param {integer} {limit} Items on page (optional)
   */
  find: function(req, res){
    let skip = (req.param('from') || 1)-1,
        limit = req.param('limit') || 20;

    //find with pagination    
    Theme.find({skip,limit})
      .populate('owner') //add owner data
      .exec(function(err, list){
        if (err){ 
          sails.log.debug('ThemeController.find error: %s', err);
          return res.json(400, {error:err}); 
        }
        else
          return res.json(200, list);
      });
  },

  /**
   * Delete theme by id
   * @param {string} {id} Theme id
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

    let themeId = req.param('id');
    //try find theme
    Theme.findOne({id:themeId}).exec((err, theme)=>{
      if(err){
        sails.log.debug('ThemeController.delete DB error: %s', err);
        return res.json(400, {error:err}); 
      }
      else{
        if(theme){
          //if found and user is owner
          if(theme.owner==req.user.id){
            Message.findOne({themeId}).exec((err, message)=>{
              if(err){
                sails.log.debug('ThemeController.delete DB error: %s', err);
                return res.json(400, {error:err}); 
              }
              else{
                //cant delete theme if has messages
                if(message) return res.json(403, {error:'Cant delete theme - has messages'});
                else{
                  //no messages in theme - delete
                  Theme.destroy({id: themeId}).exec((err2, deletedRecords)=>{
                    if(err2) return res.json(400, {error:err2});
                    else return res.ok();
                  });
                }
              }
            });
          }
          else{
            return res.json(403, 'Only owner can delete theme');
          }
        }
        else
          return res.json(404, 'Theme not found')

      }
    });
  },

  /**
   * Update theme title
   * @param {string} {id} Theme id
   * @param {string} {title} New title
   */
  update: function(req, res){
    //validate request params
    try{
      req.validate({
        id: 'string',
        title: 'string',
      });
    }catch(err){
      sails.log.debug(err);
      return res.json(400, {error:'bad params'});
    }

    let themeId = req.param('id'),
        title = req.param('title');
    //find theme by id    
    Theme.findOne({id:themeId}).exec((err, theme)=>{
      if(err){
        sails.log.debug('ThemeController.update DB error: %s', err);
        return res.json(400, {error:err}); 
      }
      else{
        if(theme){
          //if found and user is owner - try update
          if(theme.owner==req.user.id){
            Theme.update({id: themeId}, {title}).exec((err2)=>{
              if(err2) return res.json(400, {error:err2});
              else return res.ok();
            });
          }
          else{
            res.json(403, {error:'Only owner can update theme'});
          }
        }
        else
          res.json(404, {error:'Theme not found'});

      }
    });
  },
}
