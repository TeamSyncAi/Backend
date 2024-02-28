import express from "express";
const router = express.Router();
import User from "../models/user.js";
import { body } from "express-validator";
import {
  authenticateUser,
  updateUser,
  getUserById,
  getUserIdByEmail,
  displayAllUsers,
  displayUserProfile,
  banUser,
  deleteUser,
  sendActivationCode,
  forgotPassword,
  changePassword,
  verifyCode,
  ProfilePicUpload,
  createAccountUser,
} from "../controllers/userController.js";

router.post(
  "/registeruser",
  [
    body("UserName").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  createAccountUser,
);

router.put("/:id/update", updateUser);

router.post("/loginuser", authenticateUser);

router.get("/:id", getUserById);
router.get("/user/:email", getUserIdByEmail);

router.get("/", displayAllUsers);
router.get("/user/:_id", displayUserProfile);

router.put("/:id/ban", banUser);
router.delete("/:id/delete", deleteUser);

router.post("/reset", sendActivationCode);
router.post("/forgot", forgotPassword);
router.put("/change", changePassword);
router.post("/verify", verifyCode);
router.post("/updatePicture", ProfilePicUpload);
export default router;
