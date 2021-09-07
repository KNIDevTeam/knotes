const json = require('body-parser/lib/types/json');
const fs = require('fs');
const User = require('../models/user');
const sha256 = require('js-sha256');
//const session = require('express-session');

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
    }
        
    
    else{
        User.findOne({"login":login}, function (err, retusr) {
            if(err){
                console.log(err);
                res.render('register.ejs',{message:'Problem during registeration'});
            }
            console.log(retusr)
            if(retusr===null){
                const user = new User({"login":login,
                            "password":sha256(password),
                            "readperm":"",
                            "writeperm":""
                });
                user.save()
                .then((result) => console.log("success"))
                .catch((err)=>console.log(err));
                //start sesji
                req.session.user=login;
                req.session.readperm="";
                req.session.writeperm="";
                res.redirect('/');
            }else{
                res.render('register.ejs',{message:'Such user already exists'});
            }
            
        });
        // if(User.findOne({login:login})){
            
        // }
        
    
    }
}
const user_login_get=(req, res)=>{
    if(!req.session.user || req.session===undefined){
        res.render('login.ejs',{message:'Log In'});
    }
    res.redirect('/');
}
const user_login_post=(req, res)=>{
    login=req.body.login;
    password=sha256(req.body.password);
    User.findOne({"login":login, "password":password}, function (err, retusr) {
        if(err){
            console.log(err);
            res.render('login.ejs',{message:'Problem during login'});
        }
        console.log(retusr)
        if(retusr===null){
            res.render('login.ejs',{message:'Entered credentials do not match any in the database'});
        }else{
            req.session.user=retusr.login;
            req.session.readperm=retusr.readperm;
            req.session.writeperm=retusr.writeperm;
            res.redirect('/');
        }
        
    });
    //console.log(login);
    //console.log(password);
    
    
    //res.render('login.ejs',{message:'Log In'});
}

const user_logout_get=(req,res)=>{
    
    req.session.destroy();
    res.redirect('/');
    
}

module.exports = {
    user_login_get,
    user_login_post,
    user_register_get,
    user_register_post,
    user_logout_get
};