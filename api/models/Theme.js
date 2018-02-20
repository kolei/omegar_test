/**
 * Theme.js
 *
 * @description :: Themes description
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    title:{type:'string',required: true}, //theme title
    owner:{model:'user'}                  //foreign key for owner
  },
};
