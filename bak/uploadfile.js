var FormData = require('form-data'),
    fs = require('fs');

const URL = 'http://localhost:1337';

describe('Test upload avatar', function() {
  this.timeout(20000);

  it('Dont upload file for unauthorized user', function(done) {
    var form = new FormData();
    form.append('avatar', fs.createReadStream(__dirname+'/avatar.png'));
    form.submit(URL+'/user/avatar', function(err, res){
      if(err) {
        done(err);
      }
      else{
        if(res.statusCode==403) done();
        else done( new Error('Load succesfull!?') );
      }
    });
  });

  it('Upload file for authorized user', function(done) {
    var form = new FormData();
    form.append('email','kolei@yandex.ru');
    form.append('password','123456');
    form.submit(URL+'/login', function(err,res){
      if(err) done(err);
      else{
        console.log('user auth, try upload file');
        form.append('avatar', fs.createReadStream(__dirname+'/avatar.png'));
        form.submit(URL+'/user/avatar', function(err, res){
          if(err) {
            done(err);
          }
          else{
            if(res.statusCode==200) done();
            else done( res.statusCode );
          }
        });
      }
    });
  });


  // var formData = {
  //   my_field: 'my_value',
  //   my_file: fs.createReadStream(__dirname + '/unicycle.jpg'),
  // };

  // request.post({url:'http://service.com/upload', formData: formData}, function(err, httpResponse, body) {
  //   if (err) {
  //     return console.error('upload failed:', err);
  //   }
  //   console.log('Upload successful!  Server responded with:', body);
  // });
});
  