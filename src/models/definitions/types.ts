import mongoose from "mongoose";
import { TodoStatuses } from "./constants";

export type User = {
  name: string;
  email: string;
  password: string;
  date: Date;
};

export type Todo = {
  user: mongoose.Schema.Types.ObjectId; // User Id
  title: string;
  description?: string;
  status: (typeof TodoStatuses)[number];
  date: Date;
};
