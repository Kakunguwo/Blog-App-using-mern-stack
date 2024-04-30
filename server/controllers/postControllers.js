const Post = require("../models/postModel");
const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");
const {v4: uuid} = require("uuid");
const HttpError = require("../models/errorModel");


//CREATE POST
//POST /api/posts/create-post
//PROTECTED

const createPost = async (req, res, next) => {
    let {title, category, description} = req.body;
    if(!title || !category || !description || !req.files){
        return next(new HttpError("Fill in all fields.", 422));
    }

    const {thumbnail} = req.files;

    if(thumbnail.size > 2000000){
        return next(new HttpError("Thumbnail too big. Files should be less that 2Mb", 422));
    }

    let fileName = thumbnail.name;

    let splittedFileName = fileName.split('.');

    let newFilename = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1];

    thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename) ,async (err) => {
        if(err){
            return next(new HttpError(err));
        } else {
            const newPost = await Post.create({title, category, description, thumbnail : newFilename, creator : req.user.id});

            if(!newPost){
                return next(new HttpError("Post couldn't be created", 422));
            }

            // lets find user and increase the number of posts by 1

            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser.posts + 1;
            await User.findByIdAndUpdate(req.user.id, {posts: userPostCount});

            res.status(201).json(newPost);
        }

    })
}


//GET POSTS
//GET /api/posts/
//UNPROTECTED

const getPosts = async (req, res, next) => {
    try {
        const allPosts = await Post.find().sort({updatedAt: -1});

        res.status(200).json(allPosts);
    } catch (error) {
        return next(new HttpError(error))
    }
}


//GET SINGLE POST
//GET /api/posts/:id
//UNPROTECTED

const getPost = async (req, res, next) => {
   try {
    const {id} = req.params;
    const post = await Post.findById(id);
    if(!post){
        return next(new HttpError("Post not found.", 404));
    }
    res.status(200).json(post);
   } catch (error) {
    return next(new HttpError(error))
   }
}


//GET POSTS BY CATEGORY
//GET /api/posts/category/:category
//UNPROTECTED

const getCatPosts = async (req, res, next) => {
    try {
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1});
        if(!catPosts || catPosts.length === 0){
            return next(new HttpError("No posts found", 404));
        }
        res.status(200).json(catPosts);
    } catch (error) {
        return next(new HttpError(error));
    }
}


//GET POSTS BY AUTHOR
//GET /api/posts/users/:id
//UNPROTECTED

const getUserPosts = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const posts = await Post.find({creator : userId}).sort({createdAt: -1});
        res.status(200).json(posts);

    } catch (error) {
        return next(new HttpError(error));
    }
}




//EDIT POST
//PATCH /api/posts/:id
//PROTECTED

const editPost = async (req, res, next) => {
    try {
        let postId = req.params.id;
        let fileName;
        let newFilename;
        let updatedPost;
        let {title, category, description} = req.body;
        if(!title || !category || description.length < 12){
            return next(new HttpError("Fill in all the fields", 422));
        }

        //lets get the old post from the database
        const oldPost = await Post.findById(postId);

        if(req.user.id == oldPost.creator){
            if(!req.files){
                updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description}, {new: true});
            } else{
                
    
                // lets delete the old thumbnail
    
                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                    if(err){
                        return next(new HttpError(err));
                    } 
                    
                })
    
                
                // upload new thumbnail
    
                const {thumbnail} = req.files;
    
                // check size
    
                if(thumbnail.size > 2000000){
                    return next(new HttpError("Thumbnail too big. Files should be less that 2Mb", 422));
                }
            
                fileName = thumbnail.name;
            
                let splittedFileName = fileName.split('.');
            
                newFilename = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1];
    
                thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                    if(err){
                        return next(new HttpError(err));
                    }
    
                    
                })
    
                updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description, thumbnail: newFilename}, {new: true});
    
               
            }
    
            if(!updatedPost){
                return next(new HttpError("Post coundn't be updated.", 422));
            } 
    
            res.status(200).json(updatedPost);
        }
        
    } catch (error) {
        return next(new HttpError(error));
    }
}




//DELETE POST
//POST /api/posts/:id
//PROTECTED

const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if(!postId){
            return next(new HttpError("Post unavailable", 404));
        }

        const post = await Post.findById(postId);

        const fileName = post.thumbnail;

        // delete thumbnail form uploads folder

        if(req.user.id == post.creator){
            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
                if(err){
                    return next(new HttpError(err));
                } else {
                    const deletePost = await Post.findByIdAndDelete(postId);
                    if(!deletePost){
                        return next(new HttpError("Failed to delete post.", 422));
                    }
            
                    // lets find user and decrease the number of posts by 1
            
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, {posts: userPostCount});

                    res.status(200).json("Post deleted successfully");
                }
            })
        } else {
            return next(new HttpError("Cannot delete post."))
        }

       
    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports = {createPost, editPost, deletePost, getPost, getPosts, getCatPosts,getUserPosts};