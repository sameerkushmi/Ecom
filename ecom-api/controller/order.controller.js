const OrderSchema = require('../model/order.model')

const fetchAllOrder = async(req,res) =>{
    try{
        const order = await OrderSchema.find()
        .populate('user','-password')
        .populate('product')
        res.json(order)
    }catch(err){
        res.status(500).json({success : false})
    }
}

const fetchUserOrder = async(req,res) =>{
    try{
        const order = await OrderSchema.find({user : req.user.uid}).populate('product')
        res.json(order)
    }catch(err){
        res.status(500).json({success : false})
    }
}

const createOrder = async (req,res) =>{
    try{
        const order = new OrderSchema(req.body)
        await order.save()
        res.status(200).json(order)
    }catch(err){
        res.status(500).json({success : false})
    }
}

const updateStatus = async (req,res) => {
    try{
        console.log(req.params.id)
        await OrderSchema.findByIdAndUpdate(req.params.id, {status : req.body.status})
        res.status(200).json({success : true})
        
    }catch(err){
        res.status(500).json({success : false})
    }
}

const deleteOrder = (req,res) =>{
    res.send("delelte Order")
}

module.exports = {
    fetchAllOrder,
    createOrder,
    deleteOrder,
    updateStatus,
    fetchUserOrder
}