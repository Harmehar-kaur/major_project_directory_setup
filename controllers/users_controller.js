const User = require('../models/user');

// let's keep it same as before
module.exports.profile = async function(req, res) {
    try {
        const user = await User.findById(req.params.id);
        res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    } catch (err) {
        // Handle errors here
        console.error(err);
        // You can send an error response to the client if needed
        res.status(500).send('Internal Server Error');
    }
}



module.exports.update = async function(req, res) {
    try {
        if (req.user.id == req.params.id) {
            const user = await User.findByIdAndUpdate(req.params.id, req.body);
            req.flash('success', 'Updated!');
            res.redirect('back');
        } 
    } catch (err) {
        // Handle errors here
        console.error(err);
        return res.redirect('/'); 
    }
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = async function(req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (!existingUser) {
            const user = await User.create(req.body);
            req.flash('success', 'You have signed up, login to continue!');
            res.redirect('/users/sign-in');
        } else {
            req.flash('success', 'You have signed up, login to continue!');
            res.redirect('back');
        }
    } catch (err) {
        // Handle errors here
        console.error(err);
        // You can send an error response to the client if needed
        req.flash('error', err.message);
        res.redirect('back');
    }
}



// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}