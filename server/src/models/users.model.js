const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const validateEmail = (value) => {
    const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};

const validateUserName = (value) => {
    const usernameRegex = /^[a-z0-9_.]+$/;
    return usernameRegex.test(value);
};

//! private-public profile, followers folloing, birthday, social media links

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim:true,
        validate: {
            validator: validateUserName,
            message: 'Invalid username format',
        },
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: validateEmail,
            message: 'Invalid email format. Please provide a valid email address.',
        },
    },
    password: { 
        type: String, 
        validate: {
            validator: () => !this.thirdPartyLogin,
            message: 'password is required'
        }
    },
    profilePic: {               //TODO cloudinary
        type: String,
        default: '',
    }, 
    biography: {
        type: String,
        default: '',
        maxLength: 250,
    },
    posts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post' 
    }],
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment' 
    }],
    thirdPartyLogin: {
        type: Boolean,
        default: false
    },
    refreshToken:{
        type: String
    }
}, { 
    timestamps: true 
})

userSchema.pre('save', async function (next) {
    if(!(this?.thirdPartyLogin || !this.isModified('password'))) this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema);