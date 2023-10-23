const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User =require('../models/user'); 
//authentication
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passReqToCallback: true
  },
  async function (req, email, password, done) {
    try {
      // Find a user and establish the identity
      const user = await User.findOne({ email: email });

      if (!user || user.password !== password) {
        req.flash('error', 'Invalid Username/Password');
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      req.flash('error', err);
      return done(err);
    }
  }
));



//serializing the user to decide which key is to be kept in the cookies 
passport.serializeUser(function(user,done){
    done(null,user.id);
});


//deserializing the user from the key in the cookies 
passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      
      if (!user) {
        console.log('User not found in the database');
        return done(null, false);
      }
  
      return done(null, user);
    } catch (err) {
      console.log('Error in finding user --> Passport');
      return done(err);
    }
  });
  

passport.checkAuthentication =function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from a session cookie 
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;