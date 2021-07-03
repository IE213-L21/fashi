const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../app/models/user');
const bcrypt = require('bcrypt');
// generate salt to hash password
const saltRounds = 10;

passport.serializeUser(function(user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //Passport register
passport.use('local.register', new LocalStrategy({
    usernameField : 'email',
    passswordField : 'password',
    passReqToCallback : true
},function(req, email, password, done){
    User.findOne({
      'local.email' : email       
  }, function(err, user){
      if(err){
          return done(err)
      }
      if(user){
        console.log('email đã tồn tại')
          return done(null, false, {
              message : 'Email đã được sử dụng, vui lòng chọn email khác'    
          })
      }

      var newUser = new User();
      newUser.info.firstname = req.body.firstname
      newUser.info.lastname = req.body.lastname
      newUser.info.phonenumber = req.body.phonenumber
      newUser.info.address = req.body.address
      newUser.local.email = email
      newUser.role='user'
      bcrypt.hash( password, saltRounds, function(err, hash) {
        newUser.local.password=hash
          newUser.save(function(err, result) {
              if (err) {
                  return done(err);
              } else {                    
                return done(null, newUser);            
              }
          });
    });

  })
}));

/* Passport login */
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    User.findOne({
        'local.email': email
    })
        .then(function (user) {
            if (!user) {
              return done(null, false, {
                  message: 'Email not exist !!'
              });
            }
            bcrypt.compare(password, user.local.password, function (err,result) {

                if (err) { return done(err); }
                if(!result) {
                    return done(null, false, { message: 'Incorrect password !!' });
                }
                req.session.User = {
                    name:user.info.firstname,
                    email:user.local.email,
                    role:user.role
                  }                
                return done(null, user);
            })
        })
        .catch(function (err) {
            return done(err);
        })
}));