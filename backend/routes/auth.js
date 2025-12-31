import express from "express";
import { allUsers, deleteUser, forgotPassword, getUserDetails, getUserProfile, loginUser, logout, registerUser, resetPassword, updatePassword, updateProfile, updateUser, uploadAvatar } from "../controllers/authControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js"
import multer from "multer";


const router  = express.Router();
// Multer setup
const storage = multer.memoryStorage(); // keeps file in memory (good for Cloudinary)
const upload = multer({ storage });


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/upload_avatar").put(isAuthenticatedUser, uploadAvatar);







router
    .route("/admin/users")
    .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

router
    .route("/admin/users/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


export default router;