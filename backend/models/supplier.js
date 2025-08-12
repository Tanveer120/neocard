import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
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
    companyName: {
      type: String,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    alternatePhone: {
      type: String,
      trim: true,
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
    },
    website: {
      type: String,
      trim: true,
    },
    taxId: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    paymentTerms: {
      type: String,
      enum: ["immediate", "7_days", "15_days", "30_days", "45_days", "60_days", "90_days"],
      default: "30_days",
    },
    creditLimit: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    preferredPaymentMethod: {
      type: String,
      enum: ["cash", "cheque", "bank_transfer", "credit_card", "other"],
      default: "bank_transfer",
    },
    bankDetails: {
      accountName: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
      bankName: {
        type: String,
        trim: true,
      },
      ifscCode: {
        type: String,
        trim: true,
      },
      branch: {
        type: String,
        trim: true,
      },
    },
    categories: [{
      type: String,
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
    }],
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    reliability: {
      type: String,
      enum: ["excellent", "good", "average", "poor"],
      default: "average",
    },
    deliveryTime: {
      type: Number, // Average delivery time in days
      default: 7,
    },
    minimumOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    documents: [{
      name: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
      },
      type: {
        type: String,
        enum: ["license", "certificate", "contract", "other"],
      },
    }],
    lastOrderDate: {
      type: Date,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
supplierSchema.index({ pharmacyId: 1, active: 1 });
supplierSchema.index({ pharmacyId: 1, name: 1 });
supplierSchema.index({ email: 1 });
supplierSchema.index({ phone: 1 });

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier; 