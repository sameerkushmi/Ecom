const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new Schema({
    thumbnail : {
        type : String,
        trim : true
    },
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    brand : {
        type : String,
        default : 'others',
        trim : true
    },
    price : {
        type : Number,
        required : true,
        trim : true
    },
    discount : {
        type : Number,
        required : true,
        trim : true
    },
    category : {
        type : String,
        default : 'others',
        trim : true
    },
    quantity : {
        type : Number,
        required : true,
        trim : true
    }
},{timestamps:true})

const productModel = mongoose.model("Product",productSchema)
module.exports = productModel