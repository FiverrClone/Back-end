import mongoose from 'mongoose';
const Schema=mongoose.Schema;

const gigSchema = new mongoose.Schema({

    title: {type:String,require:true},
    description: {type:String,require:true},
    price: {type:String,require:true},
    createdBy:{type:Schema.Types.ObjectId,
        ref:"User"}

},{ timestamps: true });
const Gig = mongoose.model("Gig",gigSchema)

export default Gig;