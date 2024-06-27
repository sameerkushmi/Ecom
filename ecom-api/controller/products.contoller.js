const ProductSchema = require("../model/product.model")

const fetchProduct = async (req,res) =>{
    try{
        const products = await ProductSchema.find()
        res.json(products)
    }
    catch(err)
    {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const createProduct = async (req,res) =>{
    try{
        const newProduct = new ProductSchema(req.body)
        await newProduct.save()
        res.json(newProduct)
    }
    catch(err)
    {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const updateProduct = async (req,res) =>{
    const id = req.params.id
    const data = req.body
    await ProductSchema.findByIdAndUpdate(id,data)
    res.json({
        success:true,
        message : "collection updated"
    })
}

const deleteProduct = async (req,res) =>{
    const id = req.params.id
    await ProductSchema.findByIdAndDelete(id)
    res.json({
        success:true,
        message : "collection deleted"
    })
}

module.exports = {
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
}