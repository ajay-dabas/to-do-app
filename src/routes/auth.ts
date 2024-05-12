import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { authMiddleware } from "../middleware/auth";
import { Env } from "../config/env";
import { UserModel } from "../models/user";

const authRouter = Router();

// Get user by id
authRouter.get(
  "/",
  // @ts-expect-error
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req.user.id).select("-password");
      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }
  },
);

// Login user
authRouter.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  // @ts-expect-error
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await UserModel.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(payload, Env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
        if (err) {
          throw err;
        }
        return res.json({ token });
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
  },
);

export { authRouter };
