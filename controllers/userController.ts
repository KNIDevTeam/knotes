import { UserModel, User } from '../models/user';
import { sha256 } from 'js-sha256';
import { Request, Response } from 'express';

const user_register_get = (req: Request, res: Response) => {
    if (!req.session.user) {
        res.render('user/register', {title: 'Register', loged_in: false, message: 'Create your account'});
    }
    res.redirect(302, '/');
}

const user_register_post = (req: Request, res: Response) => {
    let login = req.body.login;
    let password = req.body.password;
    let password2 = req.body.password_repeated;
    if (login.length === 0) {
        res.render('user/register', {title: 'Register', loged_in: false, message: 'Login field cannot be empty'})
    } else if (password.length === 0 || password2.length === 0 || password !== password2) {
        res.render('user/register', {title: 'Register', loged_in: false, message: 'Password fields must be nonempty and must mach'})
    } else {
        UserModel.findOne({"login": login}, function (error: any, result: User) {
            if (error) {
                console.log(error);
                res.render('user/register', {title: 'Register', loged_in: false, message: 'Problem during registeration'});
            }
            console.log(result)
            if (result === null) {
                const user = new UserModel({
                    "login": login, "password": sha256(password), "readperm": "", "writeperm": ""
                });
                user.save()
                    .then((result) => console.log("success"))
                    .catch((error) => console.log(error));
                // session start
                req.session.user = login;
                req.session.readperm = "";
                req.session.writeperm = "";
                res.redirect(302, '/');
            } else {
                res.render('user/register', {title: 'Register', loged_in: false, message: 'Such user already exists'});
            }
        });
        // if(User.findOne({login:login})){

        // }
    }
}

const user_login_get = (req: Request, res: Response) => {
    if (!req.session.user) {
        res.render('user/login', {title: 'Log In', loged_in: false, message: 'Log In'});
    }
    res.redirect(302, '/');
}

const user_login_post = (req: Request, res: Response) => {
    let login = req.body.login;
    let password = sha256(req.body.password);
    UserModel.findOne({"login": login, "password": password}, function (error: any, result: User) {
        if (error) {
            console.log(error);
            res.render('user/login', {title: 'Log In', loged_in: false, message: 'Problem during login'});
        }
        console.log(result)
        if (result === null) {
            res.render('user/login', {
                title: 'Log In',
                loged_in: false,
                message: 'Entered credentials do not match any in the database'
            });
        } else {
            req.session.user = result.login;
            req.session.readperm = result.readperm;
            req.session.writeperm = result.writeperm;
            res.redirect(302, '/');
        }

    });
}

const user_logout_get = (req: Request, res: Response) => {
    req.session.destroy(error => { console.log(error) });
    res.redirect(302, '/');
}

export default {
    user_login_get, user_login_post, user_register_get, user_register_post, user_logout_get
};