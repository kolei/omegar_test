/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    themeId:{type:'string',required: true},
    title:  {type:'string',required: true},
    body:   {type:'text',required: true},
    owner:  {type:'string',required: true},
  },
};
