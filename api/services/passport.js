var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    crypto        = require('crypto');

// helper functions
function findById(id, fn) {
  User.findOne(id).exec( function(err, user){
    if (err){
      return fn(null, null);
    }else{
      return fn(null, user);
    }
  });
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  }); 
});


// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a email and password), and invoke a callback
// with a user object.
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // Find the user by email. If there is no user with the given
      // email, or the password is not correct, set the user to `false`. 
      // Otherwise, return the authenticated `user`.
      User.findOne({email: username}, function(err, user) {
        if(err) return done(err);

        if(!user){ 
          //sails.log('passport.use User.findOne: user not found');
          return done('Unknown user', false); 
        }

        //check password
        let pass = crypto.createHash('md5').update(password).digest("hex");

        if(pass==user.password) return done(null, user);
        else return done('Invalid Password', false);
      })
    });
  }
));