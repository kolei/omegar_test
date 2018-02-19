var session = require('supertest-session');

var authenticatedSession, testSession, themeId;

beforeEach(function () {
  testSession = session(sails.hooks.http.app);
});

describe('ThemeController', function() {

  describe('#login()', function() {
    it('should login user', function (done) {
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
  
  describe('#create()', function() {
    it('should create theme', function (done) {
      authenticatedSession.post('/theme')
        .send({ title: 'theme no 1' })
        .expect(200, done);
    });
  });

  describe('#find()', function() {
    it('should found theme', function (done) {
      authenticatedSession.get('/theme')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          if(Object.keys(res.body).length != 1) return done('Expect 1 theme');
          themeId = res.body[0].id;
          return done();
        });
    });
  });
  
  describe('#update()', function() {
    it('should update theme', function (done) {
      authenticatedSession.put('/theme/'+themeId)
        .send({ title: 'theme no 1 updated' })
        .expect(200, done);
    });
  });

  describe('#delete()', function() {
    it('should delete theme', function (done) {
      authenticatedSession.delete('/theme/'+themeId)
        .expect(200, done);
    });
  });

  describe('#create()', function() {
    it('should create another theme', function (done) {
      authenticatedSession.post('/theme')
        .send({ title: 'theme no 2' })
        .expect(200, done);
    });
  });
  
  describe('#find()', function() {
    it('should found second theme', function (done) {
      authenticatedSession.get('/theme')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          if(Object.keys(res.body).length != 1) return done('Expect 1 theme');
          themeId = res.body[0].id;
          return done();
        });
    });
  });

  describe('#create()', function() {
    it('should create second user', function (done) {
      testSession.post('/user')
        .send({ email: 'kolei@mail.ru', password: '123456',username:'Evgeny' })
        .expect(200, done);
    });
  });

  describe('#login()', function() {
    it('should login second user', function (done) {
      testSession.post('/user/login')
        .send({ email: 'kolei@mail.ru', password: '123456' })
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          authenticatedSession = testSession;
          return done();
        });
    });
  });

  describe('#update()', function() {
    it('should not update theme if no owner', function (done) {
      authenticatedSession.put('/theme/'+themeId)
        .send({ title: 'theme no 1 updated' })
        .expect(400, done);
    });
  });
  
});