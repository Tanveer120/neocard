import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  sku: {type:String, required:true, unique:true},
  name: {type:String, required:true},
  description: {type:String},
  category: {type:String},
  price: {type:Number, required:true},
  cost: {type:Number, default:0},
  quantity: {type:Number, default:0},
  reorderLevel: {type:Number, default:0},
  supplier: {type:String},
  expiryDate: {type:Date},
}, {timestamps:true});

// text index for quick search on name/description
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', ProductSchema);
