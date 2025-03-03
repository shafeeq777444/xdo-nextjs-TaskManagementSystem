import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  isDeleted: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "inProgress", "completed"], default: "pending" },
  attachments: [{ type: String }],
  order: { type: Number },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
