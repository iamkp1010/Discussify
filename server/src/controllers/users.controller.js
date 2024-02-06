const UserModel = require('../models/users.model')
const {OAuth2Client} = require('google-auth-library');
const { faker } = require('@faker-js/faker');
const { generateAccessToken, generateRefreshToken } = require('./token.controller');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET,'postmessage',);

async function getUserInfo(code) {
    try{
        const { tokens } = await client.getToken(code); // exchange code for tokens
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket["payload"];
    }
    catch(err){
        console.log(err)
    }
}

async function loginWithGoogle(req,res){
    try{
        if(!req.body?.code) throw new Error('Code is not attached!');
        const code = req.body.code;
        const {email, picture, given_name, family_name} = await getUserInfo(code);
        let user = await UserModel.findOne({email});
        if(!user) {
            const username = faker.internet.userName({ firstName: given_name, lastName: family_name}).toLowerCase()
            user = await UserModel.create({
                email, 
                username,
                profilePic: picture? picture: "",
                thirdPartyLogin: true
            })
        }
        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        const accessCookieExpire = new Date();
        accessCookieExpire.setTime(accessCookieExpire.getTime() + 60 * 60 * 1000);
        user.refreshToken = refreshToken
        await user.save()

        const loggedUser = await UserModel.findById(user._id).select("-password -refreshToken")

        return res.status(200)
                  .cookie("accessToken", accessToken, {httpOnly: true, sameSite: 'Lax', secure: true, expires: accessCookieExpire})
                  .cookie("refreshToken", refreshToken, {httpOnly: true, sameSite: 'Strict', secure: true, path: '/api/users/tokenRefresh'})
                  .json({user: loggedUser})
    }
    catch(err){
        console.log(err.message)
        res.status(400).json({error: err.message});
    }
}

async function register(req, res) {
    try{
        let {username, password, email} = req.body
        
        if (!username || !email || !password) throw new Error('Please provide all required fields');
  
        username = username.toLowerCase().trim();
        email = email.toLowerCase().trim();
        const existingUser = await UserModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })
        if (existingUser) throw new Error('Email or username is already registered');
    
        const user = await UserModel.create({
            username,
            email, 
            password,
        })
        const createdUser = await UserModel.findById(user._id).select("-password")
        return res.status(200).json({user:createdUser})
        
    }catch(err){
        console.log(err.message)
        res.status(400).send({error: err.message});
    }
}

async function login(req, res){
    try {
        let {email, password} = req.body
    
        if(!(email && password)) throw new Error('Please provide all required fields');
    
        email = email.toLowerCase().trim();
        
        const existingUser = await UserModel.findOne({email});

        if(!existingUser) throw new Error('User not found, Please register!');   
        if(existingUser?.thirdPartyLogin) throw new Error('User not found, You have registered using Google!');
   
        const isPwdCorrect = await existingUser.isPasswordCorrect(password);
        if(!isPwdCorrect) throw new Error('Password is incorrect');

        const accessToken = await generateAccessToken(existingUser);
        const refreshToken = await generateRefreshToken(existingUser);

        const accessCookieExpire = new Date();
        accessCookieExpire.setTime(accessCookieExpire.getTime() + 60 * 60 * 1000);
        existingUser.refreshToken = refreshToken
        await existingUser.save()

        const loggedUser = await UserModel.findById(existingUser._id).select("-password -refreshToken")
        return res.status(200)
                  .cookie("accessToken", accessToken, {httpOnly: true, sameSite: 'Lax', secure: true, expires: accessCookieExpire})
                  .cookie("refreshToken", refreshToken, {httpOnly: true, sameSite: 'Strict', secure: true, path: '/api/users/tokenRefresh'})
                  .json({user: loggedUser})
    }
    catch(err){
        console.log(err)
        res.status(400).json({error: err.message});
    }
}

async function logout(req,res){
    const user = req.body.userId
    await UserModel.findByIdAndUpdate(
        user,
        { $unset: { refreshToken: 1 } },
        { new: true }
    )
    return res.status(200)
              .clearCookie("accessToken", {httpOnly: true, sameSite: 'Lax', secure: true})
              .clearCookie("refreshToken", {httpOnly: true, sameSite: 'Strict', secure: true, path: '/api/users/tokenRefresh'})
              .json({msg: "User logged out"});
}

async function protected(req,res){
    console.log(req.user)
    res.json({msg:"done"})
}

async function fetchUserInfo(req, res){
    try{
        const username = req?.params?.username
        if(!username) throw new Error("Username is not provided!")

        const userInfo = await UserModel.findOne({username}).select("-password -refreshToken")
        if(!userInfo) throw new Error("No user found!")

        res.status(200).json(userInfo)

    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message});
    }
    
}

async function updateUser(req, res){
    
    try{
        const biography = req.body.biography
        const user = req.user
        const updatedUser = await UserModel.findOneAndUpdate({_id: user._id}, {biography}, { new: true }).select("-password -refreshToken");
        res.status(200).json({updatedUser})

    }catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
}

async function fetchRandomUsers(req, res){
    try{
        let size = Number(req.query.size)
        if(!size) size = 5;
        const users = await UserModel.aggregate([
            { 
                $sample: {
                    size: size 
                } 
            },
            {
                $project: {
                    username: 1
                }
            }
        ])
        res.status(200).json(users)
    }
    catch(err){
        console.log(err)
        res.status(400).json({error: err})
    }
}

module.exports = {
    logout,
    register,
    login,
    loginWithGoogle,
    protected,
    fetchUserInfo,
    fetchRandomUsers,
    updateUser
}