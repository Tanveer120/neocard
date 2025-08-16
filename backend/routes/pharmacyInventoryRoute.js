import express from "express";
import auth from "../middleware/auth.js";
import { register, login } from "../controllers/pharmacyInventoryAuthController.js";
import * as inventoryCtrl from "../controllers/pharmacyInventoryController.js";

const router = express.Router();

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);

// Inventory (requires auth)
router.post("/inventory", auth, inventoryCtrl.createItem);
router.get("/inventory", auth, inventoryCtrl.listItems);
router.get("/inventory/stats", auth, inventoryCtrl.inventoryStats);
router.get("/inventory/low-stock", auth, inventoryCtrl.lowStockAlerts);
router.put("/inventory/:id", auth, inventoryCtrl.updateItem);
router.delete("/inventory/:id", auth, inventoryCtrl.deleteItem);

export default router;