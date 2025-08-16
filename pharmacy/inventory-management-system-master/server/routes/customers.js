import express from 'express';
import { body, validationResult } from 'express-validator';
import Customer from '../models/Customer.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req,res)=>{
  const customers = await Customer.find().limit(200);
  res.json(customers);
});

router.get('/:id', async (req,res)=>{
  const c = await Customer.findById(req.params.id);
  if(!c) return res.status(404).json({msg:'Not found'});
  res.json(c);
});

router.post('/', auth, [body('firstName').notEmpty()], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const c = new Customer(req.body);
  await c.save();
  res.json(c);
});

router.put('/:id', auth, async (req,res)=>{
  const c = await Customer.findByIdAndUpdate(req.params.id, req.body, {new:true});
  if(!c) return res.status(404).json({msg:'Not found'});
  res.json(c);
});

router.delete('/:id', auth, async (req,res)=>{
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ok:true});
});

export default router;
