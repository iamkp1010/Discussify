const UserModel = require('../models/users.model')

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
    fetchUserInfo,
    fetchRandomUsers,
    updateUser
}