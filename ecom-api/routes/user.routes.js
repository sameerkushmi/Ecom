const express = require("express")
const {
    fetchUsers
} = require("../controller/user.controller")

const adminMiddleware = require('../middleware/admin.middlware')
const router = express.Router()

router.get('/', adminMiddleware,fetchUsers)

module.exports = router