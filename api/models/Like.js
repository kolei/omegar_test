/**
 * Like.js
 *
 * @description :: Likes for messages
 *                 User can "like" one message once
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    message:{type:'string',required: true},
    owner:  {type:'string',required: true},
  },
};
