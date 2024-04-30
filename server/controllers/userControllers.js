const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const HttpError = require("../models/errorModel");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const {v4: uuid} = require("uuid");


// REGISTER USER
//POST api/users/register
//UNPROTECTED
const registerUser = async (req, res, next) => {
    try {
        const {name, email, password, confirm_pass} = req.body;

        if(!name || !email || !password){
            return next( new HttpError("Fill in all fields", 422));
        };

        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({email : newEmail});

        if(emailExists){
            return next(new HttpError("Email already exist", 422));
        }

        if((password.trim()).length < 6){
            return next(new HttpError("Password should be at least 6 characters"));
        }

        if(password != confirm_pass){
            return next(new HttpError("Passwords do not match", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = await User.create({name, email: newEmail, password: hashedPass});

        res.status(201).json(newUser);
        
    } catch (error) {
        return next(new HttpError("User registration failed", 422));
    }
}



//LOGIN REGISTERED USER
//POST api/users/login
//UNPROTECTED
const loginUser = async (req, res, next) => {
    try {
        const {email, password } = req.body;

        if(!email || !password){
            return next(new HttpError("Fill in all fields", 422));
        }

        const userEmail = email.toLowerCase();

        await User.findOne({email: userEmail})
            .then((user)=>{
                if(!user){
                    return next(new HttpError("User doesn't exist"));
                }

                //if user exist now we compare the passwords
                bcrypt.compare(password, user.password, (err, data)=>{
                    if(err){
                        return next(new HttpError(err));
                    }

                    if(data){
                        const {_id: id, name} = user;

                        const token = jwt.sign({id, name}, process.env.JWT_SECRET);

                        res.status(200).json({token, id, name});
                    } else{
                        return next(new HttpError("Invalid login details", 422));
                    }

                    
                })

                

            })


    } catch (error) {
        return next(new HttpError("Failed to login", 422 ))
    }
}



// GET user USER
//GET api/users/:id
//PROTECTED
const getUser = async (req, res, next) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id).select('-password');
        if(!user){
            return next( new HttpError("User not found", 422));
        }

        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError("User not found", 422 ))
    }
}


// CHANGE AVATAR
//POST api/users/change-avatar
//PROTECTED
const changeAvatar = async (req, res, next) => {
    try {
        if(!req.files.avatar){
            return next(new HttpError("Please "))
        }

        //finding user from the database
        const user = await User.findById(req.user.id);

        //deleting avatar if user exists

        if(user.avatar){
            fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err)=> {
                if(err){
                    return next(new HttpError(err, 422));
                }
            })
        }

        const {avatar} = req.files;
        //check file size

        if(avatar.size > 500000){
            return next(new HttpError("This picture is to big. Should be less than 500kb", 422));
        }

        let fileName;
        fileName = avatar.name;

        let splittedFileName = fileName.split('.');

        let newFilename = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1]
        avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if(err){
                return next( new HttpError(err));
            }

            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, {avatar: newFilename}, {new: true}).select('-password');

            if(!updatedAvatar){
                return next(new HttpError("Avatar couldn't be added", 422));
            }

            res.status(200).json(updatedAvatar);
        })

    } catch (error) {
        return next(new HttpError(error,422))
    }
}


// GET AUTHORS
//Get api/users/authors
//UNPROTECTED
const getAuthor = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password');
        if(!authors){
            return next(new HttpError("No authors found", 422));

        }

        res.status(200).json(authors);
    } catch (error) {
        return next(new HttpError(error, 422));
    }
}


// EDIT USER
//PATCH api/users/edit-user
//UNPROTECTED
const editUser = async (req, res, next) => {
    try {
        const {name, email, currentPassword, newPassword, newConfirmPassword} = req.body;
        if(!name || !email ||  !currentPassword || !newPassword || !newConfirmPassword ){
            return next(new HttpError("Fill all details", 422));
        }

        //now lets get the user from the database

        const user = await User.findById(req.user.id);

        if(!user){
            return next(new HttpError("User not found", 403));
        }

        //now check the new email doesnt exist

        const emailExist = await User.findOne({email});

        if(emailExist && (emailExist._id != req.user.id)){
            return next(new HttpError("Email already exists", 422));
        }

        //compare passwords

        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);

        if(!validateUserPassword){
            return next(new HttpError("Invalid current password.", 422));
        }

        if(newPassword !== newConfirmPassword){
            return next(new HttpError("New passwords do not match", 422));
        }

        //Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        //update

        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password : hashPassword}, {new: true});

        res.status(200).json(newInfo);

        User.findByIdAndUpdate()
    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports = {registerUser, loginUser, editUser, getUser, getAuthor, changeAvatar};



