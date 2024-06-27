const jwt = require('jsonwebtoken')

const roleMidlleware = async(req, res, next)=>{
    try{
        const token = req.headers['x-auth-token']
        await jwt.verify(token,process.env.ADMIN_SECRET)
        req.body.role = 'admin'
        next()
    }catch(err){
        next()
    }
}
module.exports = roleMidlleware