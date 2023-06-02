import mongoose from "mongoose";
const Schema = mongoose.Schema;

const conversationSchema = new mongoose.Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
      populate: {
        path: "sender",
        select: "id username",
      },
    },
  ],
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
