const express = require("express")
const router = express.Router()
const {
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controller/products.contoller")
const adminMiddleware = require('../middleware/admin.middlware')

router.get("/",fetchProduct)

router.post("/",adminMiddleware,createProduct)

router.put("/:id",adminMiddleware,updateProduct)

router.delete("/:id",adminMiddleware,deleteProduct)

module.exports = router