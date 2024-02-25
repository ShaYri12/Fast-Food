import express from 'express'
import {createCart, getCart, createOrUpdateCart, updateQuantity, deleteCart} from './../controllers/cartController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

//create Cart
router.post("/", verifyUser, createCart);

//get single Cart
router.get("/:id", verifyUser, getCart);

//update or create Single Cart
router.post("/addtocart", verifyUser, createOrUpdateCart);

//update the quantity
router.put("/quantity", verifyUser, updateQuantity);

//delete Single Cart
router.delete("/:id", verifyUser, deleteCart);

// //get a user Cart total
// router.get("'/cart/total/:id'", verifyUser, getCartTotal);

export default router;