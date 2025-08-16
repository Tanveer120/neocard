import mongoose from 'mongoose';

const OrderItem = new mongoose.Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},
  quantity: {type:Number, required:true},
  price: {type:Number, required:true},
});

const OrderSchema = new mongoose.Schema({
  customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
  items: [OrderItem],
  total: {type:Number, required:true},
  status: {type:String, enum:['pending','completed','cancelled'], default:'pending'},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {timestamps:true});

export default mongoose.model('Order', OrderSchema);
