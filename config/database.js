import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();


// mongoose.set('userNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useFindAndModify', false);
mongoose.set("strictQuery", true);

class Database{

    // constructor(){
    //     this.connect();
    // }

    connect(){
        mongoose.connect(`mongodb+srv://${process.env.DB_username}:${process.env.DB_password}@${process.env.DB_cluster_name}/?retryWrites=true&w=majority`)
        .then(()=>{
            console.log("database connectionn successful");
        })
        .catch((err)=>{
            console.log("databse connection error " + err)
        })
    }
}
export default new Database();