import mongoose from 'mongoose';
const Schema=mongoose.Schema;

const messageSchema = new mongoose.Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  }
});

const Message = mongoose.model("Mesaage",messageSchema)

export default Message;