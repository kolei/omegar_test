/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  //Only explicitly described methods are allowed
  '*': false,

  UserController: {
    //disable GET requests
    find: 'isAdmin',
    findOne: false,
    //Allow anyone to register a new user
    create: true,           
    //Updates allow only authenticated users
    update: 'authenticated',
    uploadAvatar: 'authenticated',
    login: true,
    logout: 'authenticated',
    forgotPassword: true,
    activate: true,
  },

  ThemeController: {
    find: true,
    findOne: false,
    create: 'authenticated',
    update: 'authenticated',
    delete: 'authenticated',
  },

  MessageController: {
    find: true,
    findOne: true,
    create: 'authenticated',
    update: 'authenticated',
    delete: 'authenticated',
  },
 
  LikeController:{
    create: 'authenticated',
    delete: 'authenticated',
  },

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	};
