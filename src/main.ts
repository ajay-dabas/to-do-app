import "dotenv/config";
import express from "express";
import path from "path";
import { connectDatabase } from "./config/db";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { todoRouter } from "./routes/todo";

declare module "express" {
  interface Request {
    user: {
      id: string;
    };
  }
}

const app = express();

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/todos", todoRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 3001;

connectDatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server started on port http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
