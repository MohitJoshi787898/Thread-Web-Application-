import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: { type: "string", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comminity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comminity",
  },
  createdAt: { type: Date, default: Date.now() },
  parentId: { type: String },
  children:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Thread"
    }
  ]
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);
export default Thread;