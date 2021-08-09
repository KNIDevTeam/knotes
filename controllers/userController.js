const json = require('body-parser/lib/types/json');
const fs = require('fs');
const User = require('../models/user');
const sha256 = require('js-sha256');
const session = require('express-session');

const user_register_get=(req, res)=>{
    if(!req.session.user || req.session===undefined){
        res.render('register.ejs',{message:'Create your account'});
    }
    res.redirect('/');
}
const user_register_post=(req, res)=>{
    login=req.body.login;
    password=req.body.password;
    password2=req.body.password_repeated;
    if  (login.length==0){
        res.render('register.ejs',{message:'Login field cannot be empty'})
    }
    else if(password.length==0 || password2.length==0 || password!=password2 ){
        res.render('register.ejs',{message:'Password fields must be nonempty and must mach'})
    }else{
        console.log(User.findOne({login:login}));
        // if(User.findOne({login:login})){
            
        // }
        const user = new User({"login":login,
                            "password":sha256(password),
                            "readperm":"",
                            "writeperm":""
    });
    user.save()
    .then((result) => console.log("success"))
    .catch((err)=>console.log(err));
    //start sesji
    res.session.user=login;
    res.session.readperm='';
    res.session.writeperm='';
    res.redirect('/');
    }
}
const user_login_get=(req, res)=>{
    if(!req.session.user || req.session===undefined){
        res.render('login.ejs',{message:'Log In'});
    }
    res.redirect('/');
}
const user_login_post=(req, res)=>{
    res.render('login.ejs',{message:'Log In'});
}

const user_logout_get=(req,res)=>{
    if(req.session===undefined|| !req.session.user  ){
        req.session.destroy();
    }
    res.redirect('/');
    
}

module.exports = {
    user_login_get,
    user_login_post,
    user_register_get,
    user_register_post,
    user_logout_get
};