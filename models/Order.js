import mongoose from 'mongoose';
const Schema=mongoose.Schema;

const OrderSchema = new mongoose.Schema({

    gig: {type:Schema.Types.ObjectId,
        ref:"Gig"},
    customer:{type:Schema.Types.ObjectId,
            ref:"User"},
    freelancer:{type:Schema.Types.ObjectId,
            ref:"User"},
    status:{type:String,require:true},
    price: {type:Number,require:true},

},{ timestamps: true });
const Order = mongoose.model("Order",OrderSchema)

export default Order;