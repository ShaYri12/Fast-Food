import express from 'express'
import { createMenu, deleteMenu, getAllMenu, getSpecialOnes, getSingleMenu, getMenuBySearch, getMenuCount, updateMenu } from '../controllers/menuController.js'
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

//create new Menu
router.post("/", verifyAdmin, createMenu);

//update
router.put("/:id", verifyAdmin, updateMenu);

//delete
router.delete("/:id", verifyAdmin, deleteMenu);

//get single Menu
router.get("/:id", getSingleMenu);

//get all Menus or by category and search
router.get("/", getAllMenu);

//get Menu by search
router.get("/search/getMenuBySearch", getMenuBySearch);

//get featured Menu
router.get("/search/getSpecialOnes", getSpecialOnes);

router.get("/search/getMenuCount", getMenuCount);

export default router;