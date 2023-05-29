import mongoose from 'mongoose';
const Schema=mongoose.Schema;

const ReviewSchema = new mongoose.Schema({

    gig: {type:Schema.Types.ObjectId,
        ref:"Gig"},
    user:{type:Schema.Types.ObjectId,
            ref:"User"},
    rating: {type:Number,require:true},
    content: {type:String,require:true},  

},{ timestamps: true });
const Review = mongoose.model("Review",ReviewSchema)

export default Review;