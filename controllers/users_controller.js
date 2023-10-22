const User =require('../models/user');

module.exports.profile = async function(req,res){
  try{
    let user = await User.findById(req.params.id); 
    
    return res.render('user_profile',{
      title: 'User Profile', 
      profile_user:user 
    }); 
  }catch(err){
    console.log('Error', err);
    return; 
  }
}; 

module.exports.update = async  function(req,res){
  try{
    if (req.user.id == req.params.id){
      const user = await User.findByIdAndUpdate(req.params.id, req.body); 
      return res.redirect('back'); 
    }else {
    return res.status(401).send('Unauthorized'); 
    }
  }catch(err){
    console.log('Error in updating user profile:',err); 
    return res.redirect('back'); 
  }
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
  req.flash('Success','Logged In Successfully ')
  return(res.redirect('/'));    
}

module.exports.destroySesssion = function(req,res){
  req.logout();
  req.flash('Success','Logged Out Successfully ')

  return res.redirect('/');
}
