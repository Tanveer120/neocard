import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req,res)=>{
  const orders = await Order.find().populate('customer items.product').limit(200);
  res.json(orders);
});

router.get('/:id', async (req,res)=>{
  const o = await Order.findById(req.params.id).populate('customer items.product');
  if(!o) return res.status(404).json({msg:'Not found'});
  res.json(o);
});

router.post('/', auth, [
  body('items').isArray({min:1}),
  body('total').isNumeric()
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const {items, customer, total} = req.body;
  // reduce stock
  for(const it of items){
    const p = await Product.findById(it.product);
    if(!p) return res.status(400).json({msg:`Product ${it.product} not found`} )
    if(p.quantity < it.quantity) return res.status(400).json({msg:`Insufficient stock for ${p.name}`});
    p.quantity -= it.quantity;
    await p.save();
  }
  const o = new Order({items, customer, total, createdBy: req.user?.id});
  await o.save();
  res.json(o);
});

router.put('/:id/status', auth, async (req,res)=>{
  const o = await Order.findById(req.params.id);
  if(!o) return res.status(404).json({msg:'Not found'});
  o.status = req.body.status;
  await o.save();
  res.json(o);
});

export default router;
