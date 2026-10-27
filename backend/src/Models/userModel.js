// schema : design of the form
// model : actual form which u give to students

import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "please enter your name"],
            trim: true,
            maxLength: [50, "your name cannot be exceed 50 characters"]
        },
        email: {
            type: String,
            required: [true, "please enter your email"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "please enter valid email address"]
        },
        password: {
            type: String,
            required: [true, "please enter your password"],
            minLength: [6, "your password must be grater than 6 characters"],
            select: false
        },
        passwordConfirm : {
            type: String,
            required: [true, "please confirm your password"],
            validate: {
                validator: function(el) {
                    return el === this.password;                
                },
                message: "passwords do not match"
            }
        },
        phoneNumber : {
            type: String,
            required: [true, "please enter your phone number"],
            uique: true
        },
        role: {
            type: String,
            enum : ["user", "admin"],
            default: "user"
        },
        avatar: {
            url: {type: String},
            public_id: {type: String}
        },
        passwordChangedAt: {
            type: Date
        },
        passwordResetToken: {
            type: String,
            select: false,
            index: true
        },
        passwordResetExpires: {
            type: Date,
            select: false
        }
    },
    {timestamps: true}
)
// setting to not pass in response the password and other sensitive information when converting the document to JSON. This is a security measure to prevent exposing sensitive data in API responses.
userSchema.set("toJSON", {
    transfom:function(doc, ret){
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
    }
})


// password logic
// hashing
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return; //if password is not modified, then we don't need to hash it again, so we can just move on to the next middleware or save operation.

    this.password =  await bcrypt.hash(this.password, 12); // hashing the password with a salt round of 12, which is a measure of how many times the hashing algorithm will be applied to the password. A higher number means more security but also more processing time.
    this.passwordConfirm = undefined; // no need to store confirm password in the database, so we set it to undefined to remove it from the document before saving.bcz we already validated that the password and confirm password match in the schema validation step.
    // next();
})

// login check
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){ //userpassword is the hashed password stored in the database, and candidatePassword is the password entered by the user during login. This method will compare the two passwords and return true if they match, false otherwise.
    return await bcrypt.compare(candidatePassword, userPassword); // compare with the candidate password (the one entered by the user during login) with the hashed password stored in the database. It returns true if they match, false otherwise.
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){ 
    //JWTTimestamp is the timestamp of when the JWT token was issued. This method will check if the user has changed their password after the token was issued, and return true if they have, false otherwise.
    if(this.passwordChangedAt) { 
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // convert the passwordChangedAt date to a timestamp in seconds, and compare it with the JWTTimestamp. If the password was changed after the token was issued, then the user should be logged out and asked to log in again.
        return JWTTimestamp < changedTimestamp; // if the JWTTimestamp is less than the changedTimestamp, then the user has changed their password after the token was issued, and we return true. Otherwise, we return false.
    }
    return false;
}

//forgot password
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.passwordResetTokenExprires = Date.now() + 10 * 60 * 1000; //10 minutes
    return resetToken; // return the unhashed token to send it to the user via email, while the hashed version is stored in the database for security reasons.
}

const User =mongoose.model("User", userSchema);
//in mongodb : users
export {User};

// imagekit - it stores the images in the cloud and provides a URL to access them. It also provides features like image optimization, resizing, and transformation. It is used to store user avatars in this application.
// mailtrap - it is a fake SMTP server that allows developers to test email sending functionality without actually sending emails to real email addresses. It is used to test the password reset functionality in this application.