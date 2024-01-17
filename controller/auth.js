const bcrypt = require('bcryptjs');
const User = require('../models/user');


exports.getSignUp = (req,res,next)=>{
    let errorMessage = req.flash('error');
    if(errorMessage.length > 0){
        errorMessage = errorMessage[0];
    }else {
        errorMessage = null;
    }
    res.render('auth/sign-up', {
        pageTitle : 'Sign Up',
        errorMessage
    })
};

exports.getSignIn = (req,res,next)=>{
    let errorMessage = req.flash('error');
    if(errorMessage.length > 0){
        errorMessage = errorMessage[0];
    }else {
        errorMessage = null;
    }
    res.render('auth/sign-in', {
        pageTitle : 'Sign In',
        errorMessage
    })
}

exports.postSignUp = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email : email})
    .then(userDoc=>{
        if(userDoc){
            req.flash('error', 'E-Mail exists already, please pick a different one.');
            return res.redirect('/register');   
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword=>{
            const user = new User({
                email,
                password : hashedPassword
            });
            return user.save();
        })
        .then(result=>{
            res.redirect('/login');
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
};

exports.postSignIn = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email : email})
    .then(user=>{
        if(!user){
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        };
        bcrypt.compare(password, user.password)
        .then(doMatch=>{
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err=>{
                    console.log(err);
                    res.redirect('/');
                })
            };
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>{
        console.log(err);
        res.redirect('/login');
    });
}

exports.postLogout = (req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    })
}