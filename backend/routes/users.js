import express from 'express'
import {changePassowrd, deleteUser, getAllAdmins, getAllUser, getSingleUser,  updateUser } from './../controllers/userController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';
import User from '../models/User.js';

const router = express.Router();

//get basic user info (public route for user count, etc.) - must come before /:id
router.get("/public/count", async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json({
            success: true,
            data: userCount,
            message: 'User count retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get user count'
        });
    }
});

//get all Admins - must come before /:id
router.get("/search/admins", verifyAdmin, getAllAdmins);

//get all Users (for admin only)
router.get("/", verifyAdmin, getAllUser);

//update
router.put("/:id", verifyUser, updateUser);

//delete
router.delete("/:id",verifyUser, deleteUser);

//get single User
router.get("/:id", verifyUser, getSingleUser);

//Change password
router.put("/:id/password", verifyUser, changePassowrd);


export default router;