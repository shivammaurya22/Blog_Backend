import express from "express";
import {
  getAllUsers,
  promoteToAuthor,
  activities,
  demoteToUser,
  deleteUser,
  deleteAllUsers
} from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require admin role
router.use(protect, authorizeRoles("admin"));

// Admin can see all activities
router.get("/activities", activities);


// GET all users
router.get("/users", getAllUsers);

// Promote/Demote
router.put("/users/:id/promote", promoteToAuthor);
router.put("/users/:id/demote", demoteToUser);

// Delete
router.delete("/users/:id", deleteUser);
router.delete("/users", deleteAllUsers); // <-- /api/admin/users (DELETE)

export default router;
