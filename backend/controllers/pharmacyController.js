import PharmacyApplication from "../models/pharmacyApplication.js";
import { Inventory } from "../models/inventory.js"; // Corrected named import

export const applyPharmacy = async (req, res) => {
  try {
    const { pharmacyName, licenseNumber, address, phoneNumber, experience, documents } = req.body;

    const existing = await PharmacyApplication.findOne({ userId: req.user.id, status: "pending" });
    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = new PharmacyApplication({
      userId: req.user.id,
      pharmacyName,
      licenseNumber,
      address,
      phoneNumber,
      experience,
      documents,
      status: "pending",
    });

    await application.save();
    res.status(200).json({ message: "Application submitted", application });
  } catch (error) {
    console.error("Pharmacy application error:", error);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

export const checkPharmacyStatus = async (req, res) => {
  try {
    const app = await PharmacyApplication.findOne({ userId: req.user.id })
      .sort({ appliedAt: -1 })
      .select("status pharmacyName licenseNumber documents");

    if (!app) {
      return res.status(200).json({ status: "none" });
    }

    return res.status(200).json({
      status: app.status,
      pharmacyName: app.pharmacyName,
      licenseNumber: app.licenseNumber,
      documents: app.documents,
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ message: "Unable to check pharmacy application status" });
  }
};

// Add inventory management endpoints

export const addInventoryItem = async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;
    const pharmacyId = req.user.id; // Assuming the pharmacy ID is the same as the user ID

    const item = new Inventory({
      pharmacyId,
      name,
      description,
      quantity,
      price,
    });

    await item.save();
    res.status(201).json({ message: "Inventory item added", item });
  } catch (error) {
    console.error("Add inventory item error:", error);
    res.status(500).json({ message: "Failed to add inventory item" });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const { itemId, name, description, quantity, price } = req.body;

    const item = await Inventory.findByIdAndUpdate(
      itemId,
      { name, description, quantity, price },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Inventory item updated", item });
  } catch (error) {
    console.error("Update inventory item error:", error);
    res.status(500).json({ message: "Failed to update inventory item" });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    const result = await Inventory.findByIdAndDelete(itemId);

    if (!result) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Inventory item deleted", itemId });
  } catch (error) {
    console.error("Delete inventory item error:", error);
    res.status(500).json({ message: "Failed to delete inventory item" });
  }
};

export const listInventoryItems = async (req, res) => {
  try {
    const pharmacyId = req.user.id; // Assuming the pharmacy ID is the same as the user ID

    const items = await Inventory.find({ pharmacyId });

    res.status(200).json({ message: "Inventory items fetched", items });
  } catch (error) {
    console.error("List inventory items error:", error);
    res.status(500).json({ message: "Failed to fetch inventory items" });
  }
};

export const getInventoryStats = async (req, res) => {
  try {
    const stats = await Inventory.aggregate([
      { $group: { _id: null, totalItems: { $sum: 1 }, totalValue: { $sum: "$value" } } }
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory stats" });
  }
};