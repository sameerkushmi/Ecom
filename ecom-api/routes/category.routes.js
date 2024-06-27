const express = require('express')
const {createCategory,fetchCategory} = require('../controller/category.controller')
const adminMiddleware = require('../middleware/admin.middlware')
const router = express.Router()

router.post('/',adminMiddleware,createCategory)
router.get('/',fetchCategory)

module.exports = router