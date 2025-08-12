import mongoose from "mongoose";

const inventoryTransactionSchema = new mongoose.Schema(
  {
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
    },
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PharmacyInventory",
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: [
        "purchase",           // Stock purchase from supplier
        "sale",              // Sale to customer
        "return",            // Return from customer
        "adjustment",        // Manual stock adjustment
        "transfer_in",       // Transfer from another location
        "transfer_out",      // Transfer to another location
        "damage",            // Damaged/expired stock
        "theft",             // Theft/loss
        "expiry",            // Expired stock removal
        "initial_stock",     // Initial stock setup
        "correction"         // Stock correction
      ],
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    stockBefore: {
      type: Number,
      required: true,
    },
    stockAfter: {
      type: Number,
      required: true,
    },
    batchNumber: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: Date,
    },
    referenceNumber: {
      type: String,
      trim: true,
    },
    invoiceNumber: {
      type: String,
      trim: true,
    },
    supplier: {
      name: {
        type: String,
        trim: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
      },
    },
    customer: {
      name: {
        type: String,
        trim: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    reason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "cheque", "credit", "other"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partial", "cancelled"],
      default: "paid",
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "approved",
    },
    attachments: [{
      type: String, // Cloudinary URLs for receipts, invoices, etc.
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
inventoryTransactionSchema.index({ pharmacyId: 1, transactionType: 1 });
inventoryTransactionSchema.index({ pharmacyId: 1, createdAt: -1 });
inventoryTransactionSchema.index({ inventoryId: 1, createdAt: -1 });
inventoryTransactionSchema.index({ referenceNumber: 1 });
inventoryTransactionSchema.index({ invoiceNumber: 1 });

// Pre-save middleware to calculate total amount
inventoryTransactionSchema.pre('save', function(next) {
  if (this.quantity && this.unitPrice) {
    this.totalAmount = this.quantity * this.unitPrice;
  }
  next();
});

const InventoryTransaction = mongoose.model("InventoryTransaction", inventoryTransactionSchema);

export default InventoryTransaction; 