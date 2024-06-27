const uploadFile = (req,res) => {
    const {destination,filename} = req.file
    const path = destination+filename
    res.status(200).json({succcess:true,path:path,filename:filename})
}

module.exports ={
    uploadFile
}