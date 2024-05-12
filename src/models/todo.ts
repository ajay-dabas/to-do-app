import mongoose from "mongoose";
import { TodoStatuses } from "./definitions/constants";
import { Todo } from "./definitions/types";

export const TodoModel = mongoose.model(
  "todo",
  new mongoose.Schema<Todo>({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: TodoStatuses,
      default: "todo",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }),
);
