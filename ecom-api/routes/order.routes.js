const express = require("express")
const {
    fetchAllOrder,
    updateStatus,
    fetchUserOrder
} = require("../controller/order.controller")
const userMiddleware = require('../middleware/authorization.middleware')
const adminMiddleware = require('../middleware/admin.middlware')
const router = express.Router()

router.get('/',adminMiddleware,fetchAllOrder )
router.get('/user',userMiddleware,fetchUserOrder )
router.put('/:id',adminMiddleware,updateStatus)

module.exports = router