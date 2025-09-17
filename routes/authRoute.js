import express from "express";
import { register, login, me, updateUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, me);
router.put('/update-user', protect, updateUser);

// protected routes
// router.get("/dashboard", protect, async (req, res)=>{
//    try{
//      const user = await User.findById(req.user._id);

//      if(!user){
//         return res.status(404).json({message: "User not Found."});
//      }
//     res.status(200).json({message: `Welcome User ${user.name}`});
//    }catch(err){
//     res.status(500).json({message: "server Error", error: error.message});
//    }
// });

// router.put('/update', protect, async (req, res)=> {
//    try {
//       const { name } = req.body;
//       if(!name) return res.status(400).json({message: "Name is required"});
//       const updateUser = await User.findByIdAndUpdate(
//          req.user._id,
//          {name},
//          {new: true}
//       ).select("-password")
//          res.json({
//             message:"Name Updated Successfully",
//             user: updateUser
//          });
//    } catch (error) {
//       res.status(500).json({
//          message: "Server Error",
//          error: error.message
//       });
//    }
// })

// // at the bottom of authRoutes.js
// router.get("/admin/users", protect, async (req, res) => {
//   try {
//     const users = await User.find().select("-password -__v");
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// router.delete("/admin/users/:id", protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     await user.deleteOne();
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

export default router;