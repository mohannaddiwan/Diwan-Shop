const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    user:{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        },
        name:{type:String,},
        lastName:{type:String,},
        email:{type:String,},
        tel:{type:String}
    },
    items:[
        {
        product:{
            type:Object,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        size:{
            type:String,
            required:true
        },
        color:{
            type:String,
            required:true
        }
    }
],
    date:{
        type:Date,
        default:Date.now()
    },
    orderId:{
        type:String,
        required:true
    }
})
module.exports =  mongoose.model("Order",OrderSchema)