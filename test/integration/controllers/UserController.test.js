var session = require('supertest-session');

var authenticatedSession, testSession;

beforeEach(function () {
  testSession = session(sails.hooks.http.app);
});

describe('UserController', function() {
  describe('#create()', function() {
    it('should create user', function (done) {
      testSession.post('/user')
        .send({ email: 'kolei@yandex.ru', password: '123456',username:'Evgeny' })
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
  });

  describe('#login()', function() {
    it('should login user', function (done) {
      testSession.post('/user/login')
        .send({ email: 'kolei@yandex.ru', password: '123456' })
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
  });
  
  describe('#update()', function() {
    it('should update user', function (done) {
      // request(sails.hooks.http.app)
      authenticatedSession.put('/user')
        .send({username:'Evgeny Kolesnikov'})
        .expect(200, done);
    });
  });

  describe('#logout()', function() {
    it('should logout user', function (done) {
      authenticatedSession.get('/user/logout')
        .expect(200, done);
    });
  });
  
  describe('#forgotPassword()', function() {
    this.timeout(20000);
    it('should send mail with activate code', function (done) {
      testSession.post('/user/forgot_password')
        .send({ email: 'kolei@yandex.ru' })
        .expect(200, done);
    });
  });
  
  describe('#activate()', function() {
    it('should activate account', function (done) {
      testSession.post('/user/activate')
        .send({ email: 'kolei@yandex.ru', activateCode:sails.config.testActivateCode, password: '123457'})
        .expect(200, done);
    });
  });

  describe('#login()', function() {
    it('should login with new password', function (done) {
      testSession.post('/user/login')
        .send({ email: 'kolei@yandex.ru', password: '123457' })
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
  });

  describe('#uploadAvatar()', function() {
    it('should upload avatar', function (done) {
      authenticatedSession.post('/user/avatar')
        .attach('avatar', 'test/avatar.png')
        .expect(200, done);
    });
  });
  
});