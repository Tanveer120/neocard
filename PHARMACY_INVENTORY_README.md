# Pharmacy Inventory Management System

## Overview

The Pharmacy Inventory Management System is a comprehensive solution designed for real pharmacy operations. It provides advanced inventory management capabilities with features suitable for professional pharmacy environments.

## 🏥 Features

### Core Inventory Management
- **Item Management**: Add, edit, and manage pharmaceutical items
- **Stock Tracking**: Real-time stock level monitoring
- **Category Management**: Organized by medical categories (Antibiotics, Pain Relief, etc.)
- **Barcode/SKU Support**: Unique identification for each item
- **Batch Management**: Track different batches with expiry dates
- **Location Tracking**: Shelf, rack, and position management

### Advanced Stock Control
- **Reorder Points**: Automatic low stock alerts
- **Minimum/Maximum Stock**: Set optimal stock levels
- **Stock Adjustments**: Purchase, sale, return, damage, theft tracking
- **Expiry Management**: Monitor and alert for expiring items
- **Controlled Substances**: Special tracking for regulated medications

### Financial Management
- **Cost Price Tracking**: Monitor purchase costs
- **Selling Price Management**: Set retail prices
- **Profit Margin Calculation**: Automatic margin calculation
- **Tax Management**: Support for different tax rates
- **Total Inventory Value**: Real-time valuation

### Supplier Management
- **Supplier Database**: Complete supplier information
- **Contact Management**: Multiple contact methods
- **Payment Terms**: Flexible payment arrangements
- **Performance Tracking**: Supplier ratings and reliability
- **Order History**: Track supplier relationships

### Professional Features
- **Prescription Requirements**: Flag prescription-only medications
- **Storage Conditions**: Temperature and light requirements
- **Document Management**: Store licenses, certificates, etc.
- **Image Support**: Product images and documentation
- **Notes & Comments**: Detailed item information

## 🗄️ Database Models

### PharmacyInventory
```javascript
{
  pharmacyId: ObjectId,
  name: String,
  genericName: String,
  brandName: String,
  category: String,
  dosageForm: String,
  strength: String,
  unit: String,
  barcode: String,
  sku: String,
  currentStock: Number,
  minimumStock: Number,
  maximumStock: Number,
  reorderPoint: Number,
  costPrice: Number,
  sellingPrice: Number,
  expiryDate: Date,
  batchNumber: String,
  location: {
    shelf: String,
    rack: String,
    position: String
  },
  storageConditions: String,
  prescriptionRequired: Boolean,
  controlledSubstance: Boolean,
  active: Boolean
}
```

### InventoryTransaction
```javascript
{
  pharmacyId: ObjectId,
  inventoryId: ObjectId,
  transactionType: String, // purchase, sale, return, adjustment, etc.
  quantity: Number,
  unitPrice: Number,
  totalAmount: Number,
  stockBefore: Number,
  stockAfter: Number,
  batchNumber: String,
  expiryDate: Date,
  reason: String,
  notes: String,
  createdBy: ObjectId,
  status: String
}
```

### Supplier
```javascript
{
  pharmacyId: ObjectId,
  name: String,
  companyName: String,
  contactPerson: String,
  email: String,
  phone: String,
  address: Object,
  paymentTerms: String,
  creditLimit: Number,
  rating: Number,
  reliability: String,
  categories: [String],
  active: Boolean
}
```

## 🚀 API Endpoints

### Inventory Management
- `POST /api/pharmacy-inventory/add` - Add new inventory item
- `GET /api/pharmacy-inventory/items` - Get all items with filtering
- `GET /api/pharmacy-inventory/item/:id` - Get single item with transactions
- `PUT /api/pharmacy-inventory/item/:id` - Update inventory item
- `POST /api/pharmacy-inventory/adjust-stock` - Adjust stock levels

### Alerts & Reports
- `GET /api/pharmacy-inventory/low-stock-alerts` - Get low stock items
- `GET /api/pharmacy-inventory/stats` - Get dashboard statistics

## 🎨 Frontend Features

### Dashboard
- **Real-time Statistics**: Total items, out of stock, low stock, total value
- **Quick Actions**: Add item, search inventory, view reports
- **Low Stock Alerts**: Immediate visibility of items needing reorder
- **Recent Activity**: Latest inventory transactions

### Inventory Management
- **Advanced Search**: Search by name, generic name, barcode, SKU
- **Category Filtering**: Filter by medical categories
- **Stock Status Filtering**: Filter by stock levels
- **Pagination**: Handle large inventory lists
- **Bulk Operations**: Import/export capabilities

### Professional UI
- **Responsive Design**: Works on desktop and mobile
- **Professional Styling**: Blue color scheme with modern design
- **Status Indicators**: Color-coded stock and expiry status
- **Interactive Elements**: Hover effects and smooth transitions

## 🔧 Technical Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT Authentication**
- **Cloudinary** for file uploads
- **Advanced indexing** for performance

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Toastify** for notifications
- **Heroicons** for icons

## 📊 Business Intelligence

### Stock Analytics
- **Stock Turnover**: Track item movement
- **Profit Analysis**: Monitor margins by category
- **Expiry Tracking**: Minimize waste
- **Reorder Optimization**: Maintain optimal stock levels

### Financial Reports
- **Inventory Valuation**: Real-time total value
- **Cost Analysis**: Track purchase costs
- **Revenue Tracking**: Monitor sales performance
- **Profit Margins**: Category-wise profitability

## 🔒 Security Features

- **JWT Authentication**: Secure API access
- **Role-based Access**: Pharmacy-specific access
- **Data Validation**: Input sanitization
- **Audit Trail**: Complete transaction history
- **Backup Support**: Data protection

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pharmacy-inventory-system
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../pharmacy
npm install
```

3. **Environment Setup**
```bash
# Backend .env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

4. **Start the application**
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../pharmacy
npm run dev
```

## 📈 Usage Examples

### Adding a New Item
```javascript
const newItem = {
  name: "Paracetamol 500mg",
  genericName: "Acetaminophen",
  category: "Pain Relief",
  dosageForm: "Tablet",
  strength: "500mg",
  unit: "mg",
  currentStock: 100,
  minimumStock: 20,
  reorderPoint: 30,
  costPrice: 2.50,
  sellingPrice: 5.00,
  expiryDate: "2025-12-31",
  batchNumber: "BATCH001",
  prescriptionRequired: false
};
```

### Stock Adjustment
```javascript
const adjustment = {
  inventoryId: "item_id",
  quantity: 50,
  transactionType: "purchase",
  reason: "New stock received",
  notes: "From supplier ABC Pharma"
};
```

## 🎯 Best Practices

### Inventory Management
- Set appropriate reorder points based on usage patterns
- Regular expiry date monitoring
- Maintain accurate supplier information
- Use barcodes for efficient scanning
- Regular stock audits

### Data Management
- Regular backups of inventory data
- Monitor system performance
- Keep supplier information updated
- Document all stock adjustments
- Maintain audit trails

## 🔮 Future Enhancements

### Planned Features
- **Barcode Scanner Integration**: Mobile app with camera scanning
- **Automated Reordering**: AI-powered reorder suggestions
- **Multi-location Support**: Chain pharmacy management
- **Advanced Analytics**: Predictive analytics for demand
- **Integration APIs**: Connect with suppliers and distributors
- **Mobile App**: Native mobile application
- **Reporting Engine**: Advanced reporting and analytics
- **Email Notifications**: Automated alerts and reports

### Integration Possibilities
- **POS Systems**: Connect with point-of-sale systems
- **Accounting Software**: Financial integration
- **Supplier Portals**: Direct supplier communication
- **Regulatory Compliance**: Automated compliance reporting
- **Insurance Systems**: Insurance claim integration

## 📞 Support

For technical support or feature requests, please contact the development team.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This system is designed for professional pharmacy use and includes features required for regulatory compliance and efficient pharmacy operations. 