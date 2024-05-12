import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Env } from "../config/env";

export const authMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Get token from header
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "Authorization denied" });
  }

  // Verify token
  try {
    jwt.verify(token, Env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        if (!decoded || typeof decoded === "string") {
          return res.status(401).json({ msg: "Token is not valid" });
        }
        req.user = decoded.user;
        return next();
      }
    });
  } catch (err) {
    console.error("Middleware error");
    return res.status(500).json({ msg: "Server Error" });
  }
};
