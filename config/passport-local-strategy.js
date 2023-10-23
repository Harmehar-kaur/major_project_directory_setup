const passport = require('passport');

const LocalStratergy = require('passport-local').Strategy;

const User =require('../models/user'); 
//authentication
passport.use(new LocalStratergy({
    usernameField:'email',
    passReqToCallback: true 
    }, 
    function(email,password,done){
        //find a user and establish the identity
        User.findOne({email:email},function(err, user){
            if(err){
                req.flash('error',err);
                return done(err);
            }
            //user not found or password mismatch
            if(!user || user.password != password){
                req.flash('error','Invalid Username/Password');
                return done(null,false);
            }

            return done(null,user);
        });
    }

));


//serializing the user to decide which key is to be kept in the cookies 
passport.serializeUser(function(user,done){
    done(null,user.id);
});


//deserializing the user from the key in the cookies 
passport.deserializeUser(function(id,done){
    User.findById(id ,function(err,user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null,user);
    });
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