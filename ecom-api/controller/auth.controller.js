const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const UserSchema = require("../model/user.model")

const login = async (req,res) =>{
    const {email,password} = req.body
    const user = await UserSchema.findOne({email : email})
    // user does not exist
    if(!user)
    return res.status(404).json({success:false, message : "User does not exists"})
    // matching password
    const isMatched = await bcrypt.compare(password,user.password)
    // password incorrect
    if(!isMatched)
    return res.status(401).json({success:false, message : "Incorrect Password"})

    // login success
    const payload = {
        fullname : user.fullname,
        email : user.email,
        uid : user._id,
        mobile : user.mobile,
        address : user.address,
        role : user.role
    }

    const secret = (user.role === 'admin' ? process.env.ADMIN_SECRET : process.env.AUTH_SECRET)    
    const token = jwt.sign(payload, secret, {expiresIn : '7d'})

    res.json({success:true,token: token})
}

const signup = async (req,res) =>{
    try{
        const user = new UserSchema(req.body)
        await user.save()
        // signup success
        const payload = {
            fullname : user.fullname,
            email : user.email,
            uid : user._id,
            mobile : user.mobile,
            address : user.address,
            role : user.role
        }

        const token = jwt.sign(payload, process.env.AUTH_SECRET, {expiresIn : '7d'})

        res.json({success:true,token: token})
    }
    catch(err)
    {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const forgotPassword = (req,res) =>{
    res.send("forgot password")
}

module.exports = {
    login,
    signup,
    forgotPassword
}