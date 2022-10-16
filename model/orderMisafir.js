const mongoose = require("mongoose");

const OrderMisafirSchema = mongoose.Schema({
    
  orderId:{
    type:String,
    required:true
    
},
        userName:{
          type:String,
          required:true
        },
        lastName:{
          type:String,
          required:true
        },
        email:{
          type:String,
          required:true
        },
        tel:{
          type:String,
          required:true
        },
        name:{
          type:String,
          required:true
        },
        description:{
          type:String,
          required:true
        },
        size:{
          type:String,
          required:true
        },
        color:{
          type:String,
          required:true
        },
        price:{
          type:String,
          required:true
        },
        image: [
          {
            type: String,
            required: true,
          },
        ],
        quantity:{
          type:Number,
            required:true
        }

    
  

   
})
module.exports =  mongoose.model("OrderMisafir",OrderMisafirSchema)