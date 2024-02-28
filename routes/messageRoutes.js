// messageRoutes.js
import express from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/MessageController.js";

const router = express.Router();
router.route("/create").post(createMessage).get(getMessages);

export default router;
