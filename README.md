# omegar_test - api forum for a hypothetical application (test task)

The application is executed on the [Sails.js](http://sailsjs.org) framework

## Installation

For the server to work, you need to install the Git, Node.js and the Sails.js frameworks

First clone repository
```
git clone https://github.com/kolei/omegar_test.git
```

then enter project directory
```
cd omegar_test
```

and make
```
npm install
```

## Testing

The application supports automatic testing. For testing, the mocha and gulp modules must be installed

```
npm i mocha -g
npm i gulp -g
```

Then run tests by command

```
gulp test
``` 

## API

All application methods can be performed by sending a HTTP request to the desired endpoint

### Manage users

#### Create user
```
POST /user

params: 
  email=nothere@inthe.net
  username=User+Name
  password=123456

result (HttpResult: 200):
  {
    "email": "email address",
    "username": "user name",
    "createdAt": "2018-02-20T17:50:02.853Z",
    "updatedAt": "2018-02-20T17:50:02.853Z",
    "id": "5a8c5fca3791d120a0b3eb4e"
  }

errors (HttpResult: 400):  
  {error:'error description'}
```

#### Login user
```
POST /user/login

params:
  email=nothere@inthe.net
  password=123456

result (HttpResult: 200):
  {
    "email": "email address",
    "username": "user name",
    "createdAt": "2018-02-20T17:50:02.853Z",
    "updatedAt": "2018-02-20T17:50:02.853Z",
    "id": "5a8c5fca3791d120a0b3eb4e"
  }

errors (HttpResult: 400, 401):  
  {error:'error description'}
```

#### Update user (only authenticated users)
```
PUT /user

params: 
  email=nothere@inthe.net (optional)
  username=User+Name      (optional)
  password=123456         (optional)

result (HttpResult: 200):
  [{
    "email": "email address",
    "username": "updated user name",
    "createdAt": "2018-02-20T17:50:02.853Z",
    "updatedAt": "2018-02-20T17:50:02.853Z",
    "id": "5a8c5fca3791d120a0b3eb4e"
  }]

errors (HttpResult: 400):  
  {error:'error description'}
```

#### Upload avatar (only authenticated users)
Need send multipart/form-data with file in field 'avatar'
```
POST /user/avatar

params: 
  avatar - file

OK (HttpResult: 200)

errors (HttpResult: 400):  
  {error:'error description'}
```

#### Logout user (only authenticated users)
```
POST /user/logout

no params

OK (HttpResult: 200)

errors (HttpResult: 400):  
  {error:'error description'}
```

#### User forgot password

User send email address, application generate random activation code and send to reseived email, then must be called 'activate' method
```
POST /user/forgot_password

params: 
  email=nothere@inthe.net

OK (HttpResult: 200)

errors (HttpResult: 400, 404):
  {error:'error description'}
```

#### Confirm activation code
```
POST /user/activate
params: 
  email=nothere@inthe.net
  activateCode=123
  password=123456

OK (HttpResult: 200)

errors (HttpResult: 400, 404):  
  {error:'error description'}
```

### Manage forum themes

#### Create theme (only authenticated users)
``` 
POST /theme'

params: 
  title=theme title

result (HttpResult: 200):
  {
    "title": "updated theme",
    "owner": "5a8c5fca3791d120a0b3eb4e",
    "createdAt": "2018-02-20T17:52:41.939Z",
    "updatedAt": "2018-02-20T17:52:41.939Z",
    "id": "5a8c60693791d120a0b3eb4f"
  }
errors (HttpResult: 400):  
  {error:'error description'}
```

#### Get themes list
```
GET /theme/<skip themes count>/[<items on page (optional)>]

no params

result (HttpResult: 200):
  [
    {
      "owner": {
        "email": "email user1",
        "username": "guest",
        "createdAt": "2018-02-19T17:27:41.634Z",
        "updatedAt": "2018-02-19T17:27:41.634Z",
        "id": "5a8b090d2610b719c49b17de"
      },
      "title": "theme no 1",
      "createdAt": "2018-02-19T17:28:06.211Z",
      "updatedAt": "2018-02-19T17:28:06.211Z",
      "id": "5a8b09262610b719c49b17df"
    },
    {
      "owner": {
        "email": "email user2",
        "username": "guest2",
        "createdAt": "2018-02-20T17:50:02.853Z",
        "updatedAt": "2018-02-20T17:51:34.351Z",
        "id": "5a8c5fca3791d120a0b3eb4e"
      },
      "title": "theme no 2",
      "createdAt": "2018-02-20T17:52:41.939Z",
      "updatedAt": "2018-02-20T17:52:41.939Z",
      "id": "5a8c60693791d120a0b3eb4f"
    }
  ]
errors (HttpResult: 400):  
  {error:'error description'}
```

#### Update theme (only authenticated users and onwer) 
```
PUT /theme/<theme id>

params: 
  title=<new title>

OK (HttpResult: 200)

errors (HttpResult: 400, 403, 404):  
  {error:'error description'}
```

#### Delete theme (only authenticated users and onwer) 
```
DELETE /theme/<theme id>

no params

OK (HttpResult: 200)

errors (HttpResult: 400, 403, 404):  
  {error:'error description'}
```

### Manage messages

#### Create message (only authenticated users) 
```
POST /message/<theme id>

params: 
  title=<message title>
  body=<message body>

result (HttpResult: 200):
  {
    "themeId": "5a8c60693791d120a0b3eb4f",
    "title": "title",
    "body": "some body",
    "owner": "5a8c5fca3791d120a0b3eb4e",
    "createdAt": "2018-02-20T17:56:08.674Z",
    "updatedAt": "2018-02-20T17:56:08.674Z",
    "id": "5a8c61383791d120a0b3eb50"
  }

errors (HttpResult: 400, 403):  
  {error:'error description'}
```

#### Get messages list from theme with pagination
```
GET /message/<theme id>/<skip>/[<limit>]

no params

result (HttpResult: 200):
  [
    {
      "owner": {
        "email": "email user2",
        "username": "guest2",
        "createdAt": "2018-02-20T17:50:02.853Z",
        "updatedAt": "2018-02-20T17:51:34.351Z",
        "id": "5a8c5fca3791d120a0b3eb4e"
      },
      "themeId": "5a8c60693791d120a0b3eb4f",
      "title": "title",
      "body": "some body",
      "createdAt": "2018-02-20T17:56:08.674Z",
      "updatedAt": "2018-02-20T17:56:08.674Z",
      "id": "5a8c61383791d120a0b3eb50",
      "likes": 0
    }
  ]

errors (HttpResult: 400, 403):  
  {error:'error description'}
```

#### Get single message
```
GET /message/<message id>

no params

result (HttpResult: 200):
  {
    "owner": {
      "email": "email user2",
      "username": "guest2",
      "createdAt": "2018-02-20T17:50:02.853Z",
      "updatedAt": "2018-02-20T17:51:34.351Z",
      "id": "5a8c5fca3791d120a0b3eb4e"
    },
    "themeId": "5a8c60693791d120a0b3eb4f",
    "title": "title",
    "body": "some body",
    "createdAt": "2018-02-20T17:56:08.674Z",
    "updatedAt": "2018-02-20T17:56:08.674Z",
    "id": "5a8c61383791d120a0b3eb50",
    "likes": 0
  }
  
errors (HttpResult: 400):  
  {error:'error description'}
```

#### Update message (only authenticated users and onwer)
```
PUT /message/<message id>

no params

OK (HttpResult: 200):
  JSON with message

errors (HttpResult: 400):  
  {error:'error description'}
```  

#### Delete message (only authenticated users and onwer)
```
DELETE /message/<message id>

no params

OK (HttpResult: 200)

errors (HttpResult: 400, 403, 404):  
  {error:'error description'}
```  

### Like messages

#### Like message (only authenticated users)
```
POST /like/<message id>

no params

OK (HttpResult: 200)

errors (HttpResult: 400):  
  {error:'error description'}
```  

#### Dislike message (only authenticated users)
```
DELETE /like/<message id>
no params

OK (HttpResult: 200)

errors (HttpResult: 400):  
  {error:'error description'}
```  
