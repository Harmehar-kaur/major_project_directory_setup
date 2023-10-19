const User =require('../models/user');

module.exports.profile = function(req,res){
    res.render('user_profile',{
        title: 'User Profile'
    })
}

//render the sign up page 
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('users/profile');
    }

    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}

//render the Sign in page 
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('users/profile');
    }

    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    })
}

module.exports.create = async function (req, res) {
    try {
      if (req.body.password !== req.body.confirm_password) {
        return res.redirect('back');
      }
  
      const user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        const newUser = await User.create(req.body);
        return res.redirect('/users/sign-in');
      } else {
        return res.redirect('back');
      }
    } catch (err) {
      console.log('Error in signing up:', err);
      return res.redirect('back');
    }
  }
  

module.exports.createSession = function(req,res){
    return(res.redirect('/'));    
}

module.exports.destroySesssion = function(req,res){
    req.logout();
    return res.redirect('/');
}