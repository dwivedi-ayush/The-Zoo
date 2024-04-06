import express from "express";
import {
  getAllUsers,
  getUser,
  update,
  deleteUser,
  follow,
  unFollow,
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//Get all users
router.get("/", getAllUsers);

// Update User
router.put("/:id", verifyToken, update);

// Get User
router.get("/find/:id", getUser);

// Delete User
router.delete("/:id", verifyToken, deleteUser);

// Follow
router.put("/follow/alias/:alias/id/:id", follow);
router.put("/unfollow/alias/:alias/id/:id", unFollow);

// Unfollow
// router.put("/unfollow/:id", verifyToken, unFollow);

export default router;
