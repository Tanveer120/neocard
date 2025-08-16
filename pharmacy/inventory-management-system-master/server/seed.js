import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Customer from './models/Customer.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/ims';

async function seed(){
  await mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true});
  console.log('connected');
  await User.deleteMany({});
  await Product.deleteMany({});
  await Customer.deleteMany({});

  const admin = new User({name:'Admin', email:'admin@local', password: await bcrypt.hash('password',10), role:'admin'});
  await admin.save();

  const products = [
    {sku:'P001', name:'Paracetamol 500mg', category:'Analgesic', price:1.5, cost:0.5, quantity:200, reorderLevel:20, supplier:'Local Pharma'},
    {sku:'P002', name:'Amoxicillin 250mg', category:'Antibiotic', price:2.5, cost:1, quantity:120, reorderLevel:10, supplier:'Local Pharma'},
    {sku:'P003', name:'Cough Syrup 100ml', category:'Respiratory', price:3.0, cost:1.2, quantity:80, reorderLevel:15, supplier:'Local Pharma'}
  ];
  await Product.insertMany(products);

  const customers = [
    {firstName:'John', lastName:'Doe', phone:'+100000000', email:'john@example.com'},
    {firstName:'Jane', lastName:'Smith', phone:'+100000001', email:'jane@example.com'}
  ];
  await Customer.insertMany(customers);
  console.log('seed complete');
  process.exit(0);
}

seed().catch(err=>{console.error(err); process.exit(1)});
