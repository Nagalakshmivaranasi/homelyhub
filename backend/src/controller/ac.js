import {User} from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from"crypto";
import imagekit from "imagekit";
import { sendMail, forgotPasswordMailGenContent } from "../utils/mail.js";
import { signinToken, createSendToken, defaultAvatarUrl, filterObj } from "../utils/token.js";
import { error } from "console";

//signup - to create a new user account
const signup = async(req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            passwordConfirm : req.body.passwordConfirm,
            avatar: {
                url:req.body.avatar || defaultAvatarUrl}
        })
        createSendToken(newUser, 201, res);
    } catch(error) {
        // const duplicateField = Object.keys(error.keyPattern || {})[0];
        // const message = duplicateField ? `An account with that ${duplicateField} already exists.` : error.message;
        res.status(400).json({message: error.message});
    }
}

// login: check email and password, then give a token
const login = async(req, res)=> {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            throw new Error("please provide email and password");
        }
        const user = await User.findOne({email}).select("+password"); //to match the password through email
        if(!user || (await user.correctPassword(password, user.password)) === false) {
            throw new Error("incorrect email or password");
        }
        createSendToken(user, 200, res);
    } catch(error) {
        res.status(401).json({status: "fail", message: error.message});
    }
}

// protect - security guard in theatre like, it is also a middleware- checks token -> check valid or not -> check is it real -> user is still exists/changed password
const protect = async(req, res, next) => {
    try {
        //1.finding thw token
        let token;
        if(
            req.headers.authorization &&
            req.headers.authorization.startsWidth("Bearer") //if calling from app/postman
        ) {
            token = req.headers.authorization.split(" ")[1];
        } else if(req.cookies.jwt && req.cookies.jwt !== "loggedout"){
            token = req.cookies.jwt; //if user is calling from browser
        }
        //2.no token
        if(!token) {
            throw new Error("you are not loggedin , please login")
        }
        //3.token is real or not
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //4.token may expires, still exists
        const currentUser = await User.findById(decoded.id);
        if(!currentUser) {
            throw new Error("the user belonging to tokeb doesn't exists")
        };

        //5.if user change the password, old should n't work 
        if(currentUser.changedPasswordAfter(decoded.iat)) {
            throw new Error("password changed, please login again")
        }

        //6.all checks passed
        req.user = currentUser;
        next()
    } catch(error) {
        res.status(401).json({
            status : "fail",
            message: error.message
        })
    }
}
export {signup, login, protect};