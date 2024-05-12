import mongoose from "mongoose";
import { Env } from "./env";

export const connectDatabase = async () => {
  await mongoose.connect(Env.MONGO_URI);
  console.log("MongoDB Connected...");
};
