import express from "express";
import auth from "../middleware/auth.js";
import {
  addInventoryItem,
  getInventoryItems,
  getInventoryItem,
  updateInventoryItem,
  adjustStock,
  getLowStockAlerts,
  getInventoryStats,
} from "../controllers/pharmacyInventoryController.js";

const router = express.Router();

// Inventory management routes
router.post("/add", auth, addInventoryItem);
router.get("/items", auth, getInventoryItems);
router.get("/item/:id", auth, getInventoryItem);
router.put("/item/:id", auth, updateInventoryItem);
router.post("/adjust-stock", auth, adjustStock);

// Alerts and reports
router.get("/low-stock-alerts", auth, getLowStockAlerts);
router.get("/stats", auth, getInventoryStats);

export default router; 