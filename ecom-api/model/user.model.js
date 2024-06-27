const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema

const validateEmail = (email) =>{
    const regExp = /^[a-zA-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/
    const valid = regExp.test(email)
    return valid
}

const userSchema = new Schema({
    fullname : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
        trim : true,
        validate : {
            validator : validateEmail,
            message : 'inavalid email address'
        }
        
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minLenght : 6,
        maxLength : 15
    },
    role : {
        type : String,
        default : 'user',
        trim : true,
        enum : ['user','admin']
    },
    mobile : {
        type : String,
        required : true,
        trim : true
    },
    address : {
        type : String,
        required : true,
        trim : true
    }
}, {timestamps: true})
// unique email check for devlopment
userSchema.pre('save', async function(next){
    const count = await mongoose.model("User").countDocuments({email: this.email})
    if(count > 0) throw next(new Error("Email already exist"))
    next()
})
// password secure
userSchema.pre('save',async function(next){
    const ecryptedPassword = await bcrypt.hash(this.password.toString(), 12)
    this.password = ecryptedPassword
    next()
})

// unique email check for production
// userSchema.index({email : 1})

const userModel = mongoose.model("User",userSchema)
module.exports = userModel