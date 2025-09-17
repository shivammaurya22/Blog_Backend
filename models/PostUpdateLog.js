import mongoose from "mongoose";

const postUpdateLogSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["author", "admin", "user"], required: true },
    changes: { type: Object, required: true }, // { field: { old, new } }
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("PostUpdateLog", postUpdateLogSchema);
