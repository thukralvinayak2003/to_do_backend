import mongoose from "mongoose";

export interface ITask extends Document {
  task_title: string;
  task_description: string;
  due_date: Date;
  status: string;
  priority: string;
  userId: mongoose.Types.ObjectId;
}

// Task Schema
const taskSchema = new mongoose.Schema<ITask>({
  task_title: {
    type: String,
    required: true,
  },
  task_description: {
    type: String,
  },
  due_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["To-Do", "In Progress", "Under Review", "Completed"],
    default: "In Progress",
  },
  priority: {
    type: String,
    enum: ["Low", "High", "Medium"],
    default: "Low",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create models

taskSchema.pre(
  /^find/,
  function (
    this: mongoose.Document<
      unknown,
      {},
      mongoose.FlatRecord<{
        [x: string]: unknown;
      }>
    > &
      mongoose.FlatRecord<{
        [x: string]: unknown;
      }> &
      Required<{
        _id: unknown;
      }>,
    next
  ) {
    this.populate({
      path: "userId",
      select: "-__v ",
    });
    next();
  }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
