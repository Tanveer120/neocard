import mongoose from "mongoose";

const pharmacyInventorySchema = new mongoose.Schema(
  {
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    genericName: {
      type: String,
      trim: true,
    },
    brandName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Antibiotics",
        "Pain Relief",
        "Cardiovascular",
        "Diabetes",
        "Respiratory",
        "Gastrointestinal",
        "Vitamins & Supplements",
        "First Aid",
        "Personal Care",
        "Medical Devices",
        "OTC Medications",
        "Prescription Drugs",
        "Herbal & Natural",
        "Dental Care",
        "Eye Care",
        "Other"
      ],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    dosageForm: {
      type: String,
      enum: [
        "Tablet",
        "Capsule",
        "Syrup",
        "Injection",
        "Cream",
        "Ointment",
        "Drops",
        "Inhaler",
        "Suppository",
        "Powder",
        "Liquid",
        "Gel",
        "Patch",
        "Device",
        "Other"
      ],
    },
    strength: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["mg", "g", "ml", "mcg", "IU", "units", "pieces", "bottles", "tubes", "boxes"],
    },
    packSize: {
      type: String,
      trim: true,
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    supplier: {
      name: {
        type: String,
        trim: true,
      },
      contact: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    minimumStock: {
      type: Number,
      required: true,
      default: 10,
      min: 0,
    },
    maximumStock: {
      type: Number,
      required: true,
      default: 100,
      min: 0,
    },
    reorderPoint: {
      type: Number,
      required: true,
      default: 20,
      min: 0,
    },
    reorderQuantity: {
      type: Number,
      required: true,
      default: 50,
      min: 1,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    profitMargin: {
      type: Number,
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    batchNumber: {
      type: String,
      trim: true,
    },
    location: {
      shelf: {
        type: String,
        trim: true,
      },
      rack: {
        type: String,
        trim: true,
      },
      position: {
        type: String,
        trim: true,
      },
    },
    storageConditions: {
      type: String,
      enum: ["Room Temperature", "Refrigerated", "Frozen", "Protected from Light", "Other"],
      default: "Room Temperature",
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    controlledSubstance: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    images: [{
      type: String, // Cloudinary URLs
    }],
    documents: [{
      type: String, // Cloudinary URLs for certificates, etc.
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
pharmacyInventorySchema.index({ pharmacyId: 1, category: 1 });
pharmacyInventorySchema.index({ pharmacyId: 1, currentStock: 1 });
pharmacyInventorySchema.index({ pharmacyId: 1, expiryDate: 1 });
pharmacyInventorySchema.index({ barcode: 1 });
pharmacyInventorySchema.index({ sku: 1 });

// Virtual for stock status
pharmacyInventorySchema.virtual('stockStatus').get(function() {
  if (this.currentStock <= 0) return 'out_of_stock';
  if (this.currentStock <= this.reorderPoint) return 'low_stock';
  if (this.currentStock <= this.minimumStock) return 'critical';
  return 'in_stock';
});

// Virtual for expiry status
pharmacyInventorySchema.virtual('expiryStatus').get(function() {
  const today = new Date();
  const expiryDate = new Date(this.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring_soon';
  if (daysUntilExpiry <= 90) return 'expiring_soon';
  return 'valid';
});

// Pre-save middleware to calculate profit margin
pharmacyInventorySchema.pre('save', function(next) {
  if (this.costPrice && this.sellingPrice) {
    this.profitMargin = ((this.sellingPrice - this.costPrice) / this.costPrice) * 100;
  }
  next();
});

const PharmacyInventory = mongoose.model("PharmacyInventory", pharmacyInventorySchema);

export default PharmacyInventory;
export { PharmacyInventory };