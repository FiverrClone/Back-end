import mongoose from 'mongoose';
const Schema=mongoose.Schema;

const ReviewSchema = new mongoose.Schema({

    gig: {type:Schema.Types.ObjectId,
        ref:"Gig"},
    user:{type:Schema.Types.ObjectId,
            ref:"User"},
    star: {type:Number,require:true,enum:[1,2,3,4,5]},
    content: {type:String,require:true},  

},{ timestamps: true });
const Review = mongoose.model("Review",ReviewSchema)

export default Review;