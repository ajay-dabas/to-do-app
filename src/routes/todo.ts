import { Request, Response, Router } from "express";
import { check, validationResult } from "express-validator";
import { authMiddleware } from "../middleware/auth";
import { TodoModel } from "../models/todo";
import { UserModel } from "../models/user";
import { TodoStatuses } from "../models/definitions/constants";

const todoRouter = Router();

// Get all todos
todoRouter.get(
  "/",
  // @ts-expect-error
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const todos = await TodoModel.find({
        user: req.user.id,
      }).sort({ date: -1 });
      return res.json(todos);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }
  },
);

// Create a todo
todoRouter.post(
  "/",
  // @ts-expect-error
  authMiddleware,
  [
    check("title", "Title is required")
      .isLength({ max: 100 })
      .withMessage("Title can be atmost 100 chars")
      .not()
      .isEmpty(),
    check("description")
      .isLength({ max: 1000 })
      .withMessage("Description can be atmost 1000 chars")
      .optional(),
    check("status").isIn(TodoStatuses).optional(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await UserModel.findById(req.user.id).select("-password");

      const newTodo = new TodoModel({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        user: req.user.id,
      });

      const todo = await newTodo.save();

      return res.json(todo);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }
  },
);

// Update a todo
todoRouter.patch(
  "/:id",
  // @ts-expect-error
  authMiddleware,
  [
    check("title")
      .isLength({ max: 100 })
      .withMessage("Title can be atmost 100 chars")
      .not()
      .isEmpty()
      .optional(),
    check("description")
      .isLength({ max: 1000 })
      .withMessage("Description can be atmost 1000 chars")
      .optional(),
    check("status").isIn(TodoStatuses).optional(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const todo = await TodoModel.findById(req.params.id);

      // Check for ObjectId format and todo
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !todo) {
        return res.status(404).json({ msg: "Todo not found" });
      }

      // Check user if the todo belongs to authenticated user
      if (todo.user?.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      // Update the todo
      if (todo) {
        if (req.body.title) {
          todo.title = req.body.title;
        }
        if (req.body.description) {
          todo.description = req.body.description;
        }
        if (req.body.status) {
          todo.status = req.body.status;
        }
      }

      await todo.save();

      return res.json(todo);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }
  },
);

// Get todo by ID
todoRouter.get(
  "/:id",
  // @ts-expect-error
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const todo = await TodoModel.findById(req.params.id);
      // Check for ObjectId format and todo besides if the todo belongs to authenticated user
      if (
        !req.params.id.match(/^[0-9a-fA-F]{24}$/) ||
        !todo ||
        todo.user?.toString() !== req.user.id
      ) {
        return res.status(404).json({ msg: "Todo not found" });
      }
      return res.json(todo);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }
  },
);

// Delete a todo
todoRouter.delete(
  "/:id",
  // @ts-expect-error
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const todo = await TodoModel.findById(req.params.id);

      // Check for ObjectId format and todo
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !todo) {
        return res.status(404).json({ msg: "Todo not found" });
      }

      // Check user if the todo belongs to authenticated user
      if (todo.user?.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      await todo.deleteOne();

      return res.json({ msg: "Todo removed" });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }
  },
);

export { todoRouter };
