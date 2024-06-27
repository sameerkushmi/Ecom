require('dotenv').config()
const mongoose = require("mongoose")
mongoose.connect(process.env.DB_URL)

const express = require("express")

// require routes
const productRouter = require("./routes/product.routes")
const authRouter = require("./routes/auth.routes")
const orderRouter = require("./routes/order.routes")
const storageRouter = require("./routes/storage.routes")
const tokenRouter = require("./routes/token.routes")
const razorpayRouter = require("./routes/razorpay.routes")
const cartRouter = require("./routes/cart.routes")
const couponRouter = require('./routes/coupon.routes')
const brandRouter = require('./routes/brand.routes')
const categoryRouter = require('./routes/category.routes')
const checkoutRouter = require('./routes/checkout.routes')
const userRouter = require('./routes/user.routes')

// require session middleware
const authorizationMiddleware = require('./middleware/authorization.middleware')

const cors = require("cors")

const bodyParser = require("body-parser")

const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/')
    },
    filename: function (req, file, cb) {
        const fileArray = file.originalname.split('.')
        const lastIndex = fileArray.length-1
        const ext = fileArray[lastIndex]
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
    }
  })
  
  const upload = multer({ storage: storage })

const app = express()

app.listen(8080)

app.use(express.static('storage'))
app.use(cors({
    origin : process.env.CLIENT
}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//endpointes
app.use('/product',productRouter)
app.use('/auth',authRouter)
app.use('/order',orderRouter)
app.use('/storage',upload.single('fileData'),storageRouter)
app.use('/token',tokenRouter)
app.use('/razorpay',razorpayRouter)
app.use('/cart',authorizationMiddleware, cartRouter)
app.use('/coupon',couponRouter)
app.use('/brand',brandRouter)
app.use('/category',categoryRouter)
app.use('/checkout',authorizationMiddleware,checkoutRouter)
app.use('/user',userRouter)