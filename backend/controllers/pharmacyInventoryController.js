import PharmacyInventory from "../models/pharmacyInventory.js";
import InventoryTransaction from "../models/inventoryTransaction.js";
import Pharmacy from "../models/pharmacyModel.js";

// Get pharmacy ID from user
const getPharmacyId = async (userId) => {
  const pharmacy = await Pharmacy.findOne({ userId });
  if (!pharmacy) {
    throw new Error("Pharmacy not found");
  }
  return pharmacy._id;
};

// Add new inventory item
export const addInventoryItem = async (req, res) => {
  try {
    const pharmacyId = await getPharmacyId(req.user.id);
    
    // Generate SKU if not provided
    if (!req.body.sku) {
      const count = await PharmacyInventory.countDocuments({ pharmacyId });
      req.body.sku = `PHAR-${pharmacyId.toString().slice(-6)}-${String(count + 1).padStart(4, '0')}`;
    }

    const inventoryItem = new PharmacyInventory({
      ...req.body,
      pharmacyId,
    });

    await inventoryItem.save();

    // Create initial stock transaction
    if (req.body.currentStock > 0) {
      const transaction = new InventoryTransaction({
        pharmacyId,
        inventoryId: inventoryItem._id,
        transactionType: "initial_stock",
        quantity: req.body.currentStock,
        unitPrice: req.body.costPrice,
        totalAmount: req.body.currentStock * req.body.costPrice,
        stockBefore: 0,
        stockAfter: req.body.currentStock,
        batchNumber: req.body.batchNumber,
        expiryDate: req.body.expiryDate,
        createdBy: req.user.id,
        notes: "Initial stock setup",
      });
      await transaction.save();
    }

    res.status(201).json({
      message: "Inventory item added successfully",
      item: inventoryItem,
    });
  } catch (error) {
    console.error("Add inventory error:", error);
    res.status(500).json({ message: "Failed to add inventory item" });
  }
};

// Get all inventory items
export const getInventoryItems = async (req, res) => {
  try {
    const pharmacyId = await getPharmacyId(req.user.id);
    const {
      page = 1,
      limit = 20,
      search,
      category,
      stockStatus,
    } = req.query;

    const query = { pharmacyId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { genericName: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (stockStatus === "out_of_stock") query.currentStock = 0;
    if (stockStatus === "low_stock") {
      query.$expr = { $lte: ["$currentStock", "$reorderPoint"] };
    }

    const items = await PharmacyInventory.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PharmacyInventory.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({ message: "Failed to fetch inventory items" });
  }
};

// Get single inventory item
export const getInventoryItem = async (req, res) => {
  try {
    const pharmacyId = await getPharmacyId(req.user.id);
    const item = await PharmacyInventory.findOne({
      _id: req.params.id,
      pharmacyId,
    });

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    const transactions = await InventoryTransaction.find({
      inventoryId: item._id,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("createdBy", "firstName lastName");

    res.json({ item, transactions });
  } catch (error) {
    console.error("Get inventory item error:", error);
    res.status(500).json({ message: "Failed to fetch inventory item" });
  }
};

// Update inventory item
export const updateInventoryItem = async (req, res) => {
  try {
    const pharmacyId = await getPharmacyId(req.user.id);
    const item = await PharmacyInventory.findOneAndUpdate(
      { _id: req.params.id, pharmacyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({ message: "Inventory item updated successfully", item });
  } catch (error) {
    console.error("Update inventory error:", error);
    res.status(500).json({ message: "Failed to update inventory item" });
  }
};

// Stock adjustment
export const adjustStock = async (req, res) => {
  try {
    const pharmacyId = await getPharmacyId(req.user.id);
    const { inventoryId, quantity, reason, notes, transactionType = "adjustment" } = req.body;

    const item = await PharmacyInventory.findOne({
      _id: inventoryId,
      pharmacyId,
    });

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    const stockBefore = item.currentStock;
    let stockAfter;

    switch (transactionType) {
      case "purchase":
      case "return":
        stockAfter = stockBefore + quantity;
        break;
      case "sale":
      case "damage":
        if (stockBefore < quantity) {
          return res.status(400).json({ message: "Insufficient stock" });
        }
        stockAfter = stockBefore - quantity;
        break;
      case "adjustment":
        stockAfter = quantity;
        break;
      default:
        return res.status(400).json({ message: "Invalid transaction type" });
    }

    item.currentStock = stockAfter;
    await item.save();

    const transaction = new InventoryTransaction({
      pharmacyId,
      inventoryId,
      transactionType,
      quantity: Math.abs(quantity),
      unitPrice: item.costPrice,
      totalAmount: Math.abs(quantity) * item.costPrice,
      stockBefore,
      stockAfter,
      reason,
      notes,
      createdBy: req.user.id,
    });

    await transaction.save();

    res.json({
      message: "Stock adjusted successfully",
      item,
      transaction,
    });
  } catch (error) {
    console.error("Stock adjustment error:", error);
    res.status(500).json({ message: "Failed to adjust stock" });
  }
};

// Get low stock alerts
export const getLowStockAlerts = async (req, res) => {
  try {
    const pharmacyId = await getPharmacyId(req.user.id);
    
    const lowStockItems = await PharmacyInventory.find({
      pharmacyId,
      $expr: { $lte: ["$currentStock", "$reorderPoint"] },
      active: true,
    });

    res.json({ lowStockItems });
  } catch (error) {
    console.error("Low stock alerts error:", error);
    res.status(500).json({ message: "Failed to fetch low stock alerts" });
  }
};

// Get inventory stats
export const getInventoryStats = async (req, res) => {
  try {
    const pharmacyId = await getPharmacyId(req.user.id);
    
    const [totalItems, outOfStock, lowStock, totalValue] = await Promise.all([
      PharmacyInventory.countDocuments({ pharmacyId, active: true }),
      PharmacyInventory.countDocuments({ pharmacyId, currentStock: 0, active: true }),
      PharmacyInventory.countDocuments({
        pharmacyId,
        $expr: { $lte: ["$currentStock", "$reorderPoint"] },
        currentStock: { $gt: 0 },
        active: true,
      }),
      PharmacyInventory.aggregate([
        { $match: { pharmacyId, active: true } },
        { $group: { _id: null, total: { $sum: { $multiply: ["$currentStock", "$costPrice"] } } } },
      ]),
    ]);

    res.json({
      totalItems,
      outOfStock,
      lowStock,
      totalValue: totalValue[0]?.total || 0,
    });
  } catch (error) {
    console.error("Inventory stats error:", error);
    res.status(500).json({ message: "Failed to fetch inventory stats" });
  }
}; 

// Delete inventory item
export const deleteItem = async (req, res) => {
  try {
    const pharmacyId = await getPharmacyId(req.user.id);
    const item = await PharmacyInventory.findOneAndDelete({ _id: req.params.id, pharmacyId });
    if (!item) return res.status(404).json({ message: "Inventory item not found" });
    // Optionally log a transaction for deletion
    await InventoryTransaction.create({
      pharmacyId,
      inventoryId: item._id,
      transactionType: "delete",
      quantity: 0,
      unitPrice: item.costPrice,
      totalAmount: 0,
      stockBefore: item.currentStock,
      stockAfter: 0,
      createdBy: req.user.id,
      notes: "Item deleted",
    });

    res.json({ message: "Inventory item deleted", item });
  } catch (error) {
    console.error("Delete inventory error:", error);
    res.status(500).json({ message: "Failed to delete inventory item" });
  }
};

// Backwards-compatible named exports used by the router
export const createItem = addInventoryItem;
export const listItems = getInventoryItems;
export const getItem = getInventoryItem;
export const updateItem = updateInventoryItem;
export const inventoryStats = getInventoryStats;
export const lowStockAlerts = getLowStockAlerts;