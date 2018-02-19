var session = require('supertest-session');

var authenticatedSession, testSession, themeId, messageId;

beforeEach(function () {
  testSession = session(sails.hooks.http.app);
});

describe('LikeController', function() {

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

    it('should found theme id', function(done){
      Theme.find()
        .populate('owner')
        .limit(1)
        .exec(function(err, list){
          if (err) done(err); 
          else{
            themeId = list[0].id;
            done();
          }
        });
    });
  });
  
  describe('#find()', function() {
    it('should found message', function (done) {
      authenticatedSession.get('/message/'+themeId)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          if(Object.keys(res.body).length < 1) return done('Expect 1 message');
          messageId = res.body[0].id;
          return done();
        });
    });
  });
  
  describe('#like()', function() {
    it('should like message', function (done) {
      authenticatedSession.post('/like/'+messageId)
        .expect(200, done);
    });
  });

  describe('#dislike()', function() {
    it('should dislike message', function (done) {
      authenticatedSession.delete('/like/'+messageId)
        .expect(200, done);
    });
  });
  
  describe('#like()', function() {
    it('should not like message unauthorized user', function (done) {
      testSession.post('/like/'+messageId)
        .expect(403, done);
    });
  });
  
});