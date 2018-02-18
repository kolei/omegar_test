/**
 * ThemeController
 *
 * @description :: Server-side logic for managing themes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function (req, res) {
    let elem = {
      title: req.param('title'),
      owner: req.user.id
    };

    Theme.create(elem).exec(function (err, theme) {
      if (err){ 
        sails.log.debug('ThemeController.create error: %s', err);
        res.json(400, err); 
      }
      else
        res.json(200, theme);
    });
  },

  find: function(req, res){
    let skip = (req.param('from') || 1)-1,
        limit = req.param('limit') || 20;

    Theme.find({skip,limit}).exec(function(err, list){
      if (err){ 
        sails.log.debug('ThemeController.find error: %s', err);
        res.json(400, err); 
      }
      else
        res.json(200, list);
    });
  },

  delete: function(req, res){
    let themeId = req.param('id');
    Theme.findOne({id:themeId}).exec((err, theme)=>{
      if(err){
        sails.log.debug('ThemeController.delete DB error: %s', err);
        res.json(400, err); 
      }
      else{
        if(theme){
          if(theme.owner==req.user.id){
            Message.findOne({themeId}).exec((err, message)=>{
              if(err){
                sails.log.debug('ThemeController.delete DB error: %s', err);
                res.json(400, err); 
              }
              else{
                if(message) res.json(400, 'Cant delete theme - has messages');
                else{
                  //no messages in theme - can delete
                  Theme.destroy({id: themeId}).exec((err2, deletedRecords)=>{
                    if(err2) res.json(400, err2);
                    else res.ok();
                  });
                }
              }
            });
          }
          else{
            res.json(400, 'Only owner can delete theme');
          }
        }
        else
          res.json(400, 'Theme not found')

      }
    });
  },

  update: function(req, res){
    let themeId = req.param('id'),
        title = req.param('title');
    Theme.findOne({id:themeId}).exec((err, theme)=>{
      if(err){
        sails.log.debug('ThemeController.update DB error: %s', err);
        res.json(400, err); 
      }
      else{
        if(theme){
          if(theme.owner==req.user.id){
            Theme.update({id: themeId}, {title}).exec((err2, theme)=>{
              if(err2) res.json(400, err2);
              else res.ok();
            });
          }
          else{
            res.json(400, 'Only owner can update theme');
          }
        }
        else
          res.json(400, 'Theme not found')

      }
    });
  },
}
