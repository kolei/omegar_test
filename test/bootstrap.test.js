/**
 * Auto start/stop sails before/after any test
 */

var sails = require('sails');

before(function(done) {
  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(15000);

  sails.lift({
    // configuration for testing purposes
    models: {connection: 'testMemoryDb'},
    //activation code used in tests
    testActivateCode: '1234567890'
}, function(err) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
