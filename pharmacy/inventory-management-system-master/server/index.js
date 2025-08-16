import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import customerRoutes from './routes/customers.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => res.json({ok:true, msg: 'IMS server running'}));

const PORT = process.env.PORT || 5000;

async function start() {
  const MONGO = process.env.MONGO_URI;
  if (!MONGO) {
    console.error('Missing MONGO_URI in environment');
    process.exit(1);
  }
  await mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true});
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
