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

// Test route to check if menu routes work
router.get("/test", async (req, res) => {
    try {
        const Menu = (await import('../models/Menu.js')).default;
        const count = await Menu.countDocuments();
        res.json({
            success: true,
            message: 'Menu routes working',
            totalMenus: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Menu routes error',
            error: error.message
        });
    }
});

//update
router.put("/:id", verifyAdmin, updateMenu);

//delete
router.delete("/:id", verifyAdmin, deleteMenu);

//get single Menu
router.get("/:id", getSingleMenu);

//get all Menus or by category and search
router.get("/", getAllMenu);

export default router;