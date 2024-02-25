import express from 'express'
import {createReview } from './../controllers/reviewController.js'
import { verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

router.post("/:menuId",verifyUser, createReview);

//To delete review
// router.delete("/login", deleteReview);

export default router;