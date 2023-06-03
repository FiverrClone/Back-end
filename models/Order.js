import mongoose from 'mongoose';
const Schema=mongoose.Schema;

const OrderSchema = new mongoose.Schema({

    title:{type:String,require:true},
    informations:{type:String},
    gig: {type:Schema.Types.ObjectId,
        ref:"Gig"},
    customer:{type:Schema.Types.ObjectId,
            ref:"User"},
    freelancer:{type:Schema.Types.ObjectId,
            ref:"User"},
    status:{type:String,
        enum:["PENDING", "IN_PROGRESS","COMPLETED","CANCELLED","DECLINED"],
        default: "PENDING"},
    price: {type:Number,require:true},

},{ timestamps: true });
const Order = mongoose.model("Order",OrderSchema)

export default Order;