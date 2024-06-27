const express = require('express')
const {createCoupon,expireCoupon,fetchCoupon} = require('../controller/coupon.controller')
// middleware
const userMiddleware = require('../middleware/authorization.middleware')
const adminMiddleware = require('../middleware/admin.middlware')
const router = express.Router()

router.get('/:code',userMiddleware,fetchCoupon)
router.post('/',adminMiddleware,createCoupon)
router.delete('/:id',adminMiddleware,expireCoupon)

module.exports = router