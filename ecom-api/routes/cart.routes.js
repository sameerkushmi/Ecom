const express = require('express')
const {addToCart,removeFromCart,fetchCart} = require('../controller/cart.controller')
const userMiddleware = require('../middleware/authorization.middleware')
const router = express.Router()

router.get('/',userMiddleware,fetchCart)
router.post('/',userMiddleware,addToCart)
router.delete('/:Id',userMiddleware,removeFromCart)

module.exports = router