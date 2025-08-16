import { PharmacyInventory } from '../models/pharmacyInventory.js';

// Fetch inventory stats
const getInventoryStats = async (req, res) => {
  try {
    const stats = await PharmacyInventory.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalValue: { $sum: "$value" },
          outOfStock: { $sum: { $cond: [{ $eq: ["$currentStock", 0] }, 1, 0] } },
          lowStock: { $sum: { $cond: [{ $lt: ["$currentStock", "$reorderPoint"] }, 1, 0] } },
        },
      },
    ]);

    res.status(200).json(stats[0] || { totalItems: 0, totalValue: 0, outOfStock: 0, lowStock: 0 });
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({ error: 'Failed to fetch inventory stats' });
  }
};

// Fetch low stock alerts
const getLowStockAlerts = async (req, res) => {
  try {
    const lowStockItems = await PharmacyInventory.find({
      $expr: { $lt: ["$currentStock", "$reorderPoint"] },
    }).sort({ currentStock: 1 });

    res.status(200).json({ lowStockItems });
  } catch (error) {
    console.error('Error fetching low stock alerts:', error);
    res.status(500).json({ error: 'Failed to fetch low stock alerts' });
  }
};

// Add inventory item
const addInventory = async (req, res) => {
  try {
    const { name, currentStock = 0, reorderPoint = 0, value = 0 } = req.body;
    const newItem = new PharmacyInventory({ name, currentStock, reorderPoint, value });
    await newItem.save();

    res.status(201).json({ message: 'Inventory item added successfully', item: newItem });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ error: 'Failed to add inventory item' });
  }
};

// Get inventory list with pagination, search and sorting
const getInventory = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };

    const total = await PharmacyInventory.countDocuments(filter);
    const items = await PharmacyInventory.find(filter)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching inventory list:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

// Update inventory item
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await PharmacyInventory.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Inventory item not found' });

    res.status(200).json({ message: 'Inventory updated', item: updated });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
};

// Delete inventory item
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PharmacyInventory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Inventory item not found' });

    res.status(200).json({ message: 'Inventory item deleted' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
};

export { getInventoryStats, getLowStockAlerts, addInventory, getInventory, updateInventory, deleteInventory };
