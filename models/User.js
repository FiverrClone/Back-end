import mongoose from 'mongoose';
const Schema=mongoose.Schema;

const userSchema = new mongoose.Schema({

    firstname: {type:String,require:true},
    lastname: {type:String,require:true},
    username: {type:String,require:true,unique:true},
    email: {type:String,require:true,unique:true},
    password: {type:String,require:true},
    gender: {type:String,require:true},
    birthday: {type:String,require:true},
    role: {type:String,
            enum:["FREELANCER", "CUSTOMER"],
            default: "CUSTOMER",},
    gigs:[{type:Schema.Types.ObjectId,
        ref:"Gig"}]
//     comments:[{type:Schema.Types.ObjectId,
//         ref:"Comment"}]

},{ timestamps: true });
const User = mongoose.model("User",userSchema)

export default User;