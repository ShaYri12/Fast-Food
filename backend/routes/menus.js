import express from 'express'
import { createMenu, deleteMenu, getAllMenu, getSpecialOnes, getSingleMenu, getMenuBySearch, getMenuCount, updateMenu } from '../controllers/menuController.js'
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

//create new Menu
router.post("/", verifyAdmin, createMenu);

//get Menu by search (must come before /:id)
router.get("/search/getMenuBySearch", getMenuBySearch);

//get featured Menu (must come before /:id)
router.get("/search/getSpecialOnes", getSpecialOnes);

//get menu count (must come before /:id)
router.get("/search/getMenuCount", getMenuCount);

//update
router.put("/:id", verifyAdmin, updateMenu);

//delete
router.delete("/:id", verifyAdmin, deleteMenu);

//get single Menu
router.get("/:id", getSingleMenu);

//get all Menus or by category and search
router.get("/", getAllMenu);

export default router;