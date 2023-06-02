import mongoose from 'mongoose';
const Schema=mongoose.Schema;

const PaymentSchema = new mongoose.Schema({

    order: {type:Schema.Types.ObjectId,
        ref:"Order"},
    customer:{type:Schema.Types.ObjectId,
            ref:"User"},
    amount: {type:Number,require:true},
    paymentIntentId: {type:String,require:true},

},{ timestamps: true });
const Payment = mongoose.model("Payment",PaymentSchema)

export default Payment;