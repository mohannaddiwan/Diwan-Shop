const mongoose = require("mongoose");

const stateSchema = mongoose.Schema({
    product_durumu:{
        type:String,
        required:true
    }

 

})

module.exports = mongoose.model("state",stateSchema)