/**
 * Like.js
 *
 * @description :: Likes for messages
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    messageId:{type:'string',required: true},
    userId:   {type:'string',required: true},
  },
};
