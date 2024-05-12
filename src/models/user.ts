import mongoose from "mongoose";
import { User } from "./definitions/types";

export const UserModel = mongoose.model(
  "user",
  new mongoose.Schema<User>({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }),
);
