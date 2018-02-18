/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  //create user
  'post /user':  {controller: 'UserController', action:'create'},
  //update user
  'put /user':   {controller: 'UserController', action:'update'},
  //authenticate user
  '/user/login':  {controller: 'UserController', action: 'login'},
  '/user/logout': {controller: 'UserController', action: 'logout'},
  //upload user avatar
  'post /user/avatar': {controller: 'UserController', action:'uploadAvatar'},
  //generate activate code and send to email
  'post /user/forgot_password': {controller: 'UserController', action:'forgotPassword'},
  'post /user/activate': {controller: 'UserController', action:'activate'},


  //create theme
  'post /theme': {controller: 'ThemeController', action:'create'},
  //show themes list with pagination
  'get  /theme/:from/:limit': {controller: 'ThemeController', action:'find'},
  'post /theme/:from/:limit': {controller: 'ThemeController', action:'find'},
  'get  /theme/:from': {controller: 'ThemeController', action:'find'},
  'post /theme/:from': {controller: 'ThemeController', action:'find'},
  //update theme
  'put /theme/:id': {controller: 'ThemeController', action:'update'},
  //delete theme
  'delete /theme/:id': {controller: 'ThemeController', action:'delete'},


  //create message
  'post /message/:theme': {controller: 'MessageController', action:'create'},
  //show message list with pagination
  'get  /message/:theme/:from/:limit': {controller: 'MessageController', action:'find'},
  'post /message/:theme/:from/:limit': {controller: 'MessageController', action:'find'},
  'get  /message/:theme/:from': {controller: 'MessageController', action:'find'},
  'post /message/:theme/:from': {controller: 'MessageController', action:'find'},
  'get  /message/:theme': {controller: 'MessageController', action:'find'},
  //update message
  'put /message/:id': {controller: 'MessageController', action:'update'},
  //delete message
  'delete /message/:id': {controller: 'MessageController', action:'delete'},

  
};
