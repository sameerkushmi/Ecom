const express = require("express")
const {createOrder,fetchPayments,webhook} = require("../controller/razorpay.controller")
const userMiddleware = require('../middleware/authorization.middleware')
const adminMiddleware = require('../middleware/admin.middlware')
const router = express.Router()

router.post('/order',userMiddleware,createOrder)

router.get('/payments',adminMiddleware,fetchPayments)

router.post('/webhook',webhook)

module.exports = router