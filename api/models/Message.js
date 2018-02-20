/**
 * Message.js
 *
 * @description :: Messages description
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    themeId:{type:'string',required: true}, //Theme id
    title:  {type:'string',required: true}, //theme title
    body:   {type:'text',required: true},   //theme body
    owner:  {model:'user'},                 //foreign key for owner
  },
};
