const User =require('../models/user');

module.exports.profile = function(req,res){

    if (req.cookies.user_id){
        User.findById(req.cookies.user_id, function(err, user){
            if(user){
                res.render('user_profile',{
                    title: 'User Profile',
                    user
                })
            }
            return res.redirect('/users/sign-in');
        })
    }else{
        return res.redirect('/users/sign-in');
    }
}

//render the sign up page 
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}

//render the Sign in page 
module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    })
}

module.exports.create=function(req,res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log('Error in finding the user in signing up');
            return;
        }

        if(!user){
            User.create(req.body, function(err,user){
                if (err){
                    console.log('Error in creating user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    })
}

module.exports.createSession = function(req,res){
    //find the user 
    user.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log('Error in finding the user in signing up');
            return;
        }
        //user found 
        if(user){
            if(user.password!= req.body.password){
                return res.redirect('back');
            }
            res.cookie('user_is',user.id);
            return res.redirect('/users/profile');
        }else{
            //user not found 
            return res.redirect('back');
        }
    })
}