/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const crypto = require('crypto');

module.exports = {
  attributes: {
    email:{type:'email',required: true,unique: true},
    username:{type:'string',required: true},
    password:{type:'string',required: true, minLength: 4},
    avatar:{type:'string'},  //url to loaded file
    // override default toJSON - remove 'password' field from output
    toJSON: function() {
      let obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  // encrypt password
  beforeCreate: function (values, next) {
    values.password = crypto.createHash('md5').update(values.password).digest("hex");
    next();  	
  },
 
  beforeUpdate: function (values, next) {
    //encrypt password if its updated
    if(values.password)  
      values.password = crypto.createHash('md5').update(values.password).digest("hex");
    next();  	
  }
};

