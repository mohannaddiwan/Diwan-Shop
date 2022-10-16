const mongoose = require("mongoose");

const colorSchema = mongoose.Schema({
    colorName:{
        type:String,
        required:true
    }

 

})

module.exports = mongoose.model("Color",colorSchema)