import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';
import Audit from '../models/Audit.js';

const router = express.Router();

router.get('/', async (req,res)=>{
  const q = {};
  if(req.query.q) q.$text = {$search: req.query.q};
  const products = await Product.find(q).limit(200);
  res.json(products);
});

router.get('/:id', async (req,res)=>{
  const p = await Product.findById(req.params.id);
  if(!p) return res.status(404).json({msg:'Not found'});
  res.json(p);
});

router.post('/', auth, role(['admin','pharmacist']), [
  body('sku').notEmpty(),
  body('name').notEmpty(),
  body('price').isNumeric()
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const bodyData = req.body;
  const exist = await Product.findOne({sku: bodyData.sku});
  if(exist) return res.status(400).json({msg:'SKU exists'});
  const p = new Product(bodyData);
  await p.save();
  try{ await Audit.create({ action:'create', collection:'Product', documentId: p._id, after: p.toObject(), user: req.user ? { id: req.user.id, role: req.user.role } : undefined }); }catch(e){}
  res.json(p);
});

// public endpoint to add product (for UI flows while auth is not present)
router.post('/public', [
  body('sku').notEmpty(),
  body('name').notEmpty(),
  body('price').isNumeric()
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const bodyData = req.body;
  const exist = await Product.findOne({sku: bodyData.sku});
  if(exist) return res.status(400).json({msg:'SKU exists'});
  if(bodyData.expiryDate) bodyData.expiryDate = new Date(bodyData.expiryDate);
  const p = new Product(bodyData);
  await p.save();
  try{ await Audit.create({ action:'create', collection:'Product', documentId: p._id, after: p.toObject() }); }catch(e){}
  res.json(p);
});

router.put('/:id', auth, async (req,res)=>{
  const before = await Product.findById(req.params.id).lean();
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true});
  if(!p) return res.status(404).json({msg:'Not found'});
  try{ await Audit.create({ action:'update', collection:'Product', documentId: p._id, before, after: p.toObject(), user: req.user ? { id: req.user.id, role: req.user.role } : undefined }); }catch(e){}
  res.json(p);
});

router.delete('/:id', auth, async (req,res)=>{
  const before = await Product.findById(req.params.id).lean();
  await Product.findByIdAndDelete(req.params.id);
  try{ await Audit.create({ action:'delete', collection:'Product', documentId: req.params.id, before, user: req.user ? { id: req.user.id, role: req.user.role } : undefined }); }catch(e){}
  res.json({ok:true});
});

export default router;
