const mongoose = require("mongoose");

const sizeSchema = mongoose.Schema({
    sizeName:{
        type:String,
        required:true
    }

 

})

module.exports = mongoose.model("Size",sizeSchema)