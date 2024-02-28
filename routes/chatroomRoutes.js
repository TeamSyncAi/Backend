// chatroomRoutes.js
import express from "express";
import {
  createChatroom,
  getChatrooms,
} from "../controllers/ChatRoomController.js";

const router = express.Router();
router.route("/create").post(createChatroom).get(getChatrooms);

export default router;
