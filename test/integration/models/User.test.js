describe('UserModel', function() {
  describe('#find()', function() {
    it('should check find function', function (done) {
      User.find()
      .then((res)=>{
        done();
      },(err)=>{
        done(err);
      });
    });
  });
});