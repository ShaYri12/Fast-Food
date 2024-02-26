import express from 'express'
import {createOrder, getOrder, getAllOrder, updateOrder, deleteOrder, updatePayment } from './../controllers/orderConrtoller.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

//create Order
router.post("/", verifyUser, createOrder);

//get single Order
router.get("/:id", verifyUser, getOrder);

//update Payment of Order
router.put("/paymnet/:id", verifyAdmin, updatePayment);

//update Single Order
router.put("/:id", verifyAdmin, updateOrder);

//delete Single Order
router.delete("/:id", verifyAdmin, deleteOrder);

//get all Orders
router.get("/", verifyAdmin, getAllOrder);


export default router;