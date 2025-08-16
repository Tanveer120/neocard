import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  firstName: {type:String, required:true},
  lastName: {type:String},
  phone: {type:String},
  email: {type:String},
  address: {type:String},
  notes: {type:String},
}, {timestamps:true});

export default mongoose.model('Customer', CustomerSchema);
