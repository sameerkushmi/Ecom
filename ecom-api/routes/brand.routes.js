const express = require('express')
const {createBrand,fetchBrand} = require('../controller/brand.controller')
const adminMiddleware = require('../middleware/admin.middlware')
const router = express.Router()

router.post('/',adminMiddleware,createBrand)
router.get('/',fetchBrand)

module.exports = router