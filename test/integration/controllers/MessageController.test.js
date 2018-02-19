var session = require('supertest-session');

var authenticatedSession, testSession, themeId, messageId;

beforeEach(function () {
  testSession = session(sails.hooks.http.app);
});

describe('MessageController', function() {

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
  
  describe('#create()', function() {
    it('should create message', function (done) {
      authenticatedSession.post('/message/'+themeId)
        .send({ title: 'message no 1', body: 'body for message no 1' })
        .expect(200, done);
    });
  });

  describe('#find()', function() {
    it('should found message', function (done) {
      authenticatedSession.get('/message/'+themeId)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          if(Object.keys(res.body).length != 1) return done('Expect 1 message');
          messageId = res.body[0].id;
          return done();
        });
    });
  });
  
  describe('#update()', function() {
    it('should update message', function (done) {
      authenticatedSession.put('/message/'+messageId)
        .send({ title: 'message no 1 updated' })
        .expect(200, done);
    });
  });

  describe('#delete()', function() {
    it('should delete message', function (done) {
      authenticatedSession.delete('/message/'+messageId)
        .expect(200, done);
    });
  });

  describe('#create()', function() {
    it('should create message', function (done) {
      authenticatedSession.post('/message/'+themeId)
        .send({ title: 'message no 2', body: 'body for message no 2' })
        .expect(200, done);
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

  describe('#login()', function() {
    it('should login second user', function (done) {
      testSession.post('/user/login')
        .send({ email: 'kolei@mail.ru', password: '123456' })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          //console.log('second user: %j', res.body);
          authenticatedSession = testSession;
          return done();
        });
    });
  });

  describe('#update()', function() {
    it('should not update message if no owner', function (done) {
      authenticatedSession.put('/message/'+messageId)
        .send({ title: 'message no 2 updated' })
        .expect(400, done);
    });
  });
  
});