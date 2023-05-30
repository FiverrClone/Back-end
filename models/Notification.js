import mongoose from 'mongoose';
const Schema=mongoose.Schema;


const notificationSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    date: String,
});

const Notification = mongoose.model("Notification",notificationSchema)

export default Notification;