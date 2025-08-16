import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({min:6})
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const {name,email,password,role} = req.body;
  let u = await User.findOne({email});
  if(u) return res.status(400).json({msg:'Email already registered'});
  const hashed = await bcrypt.hash(password, 10);
  u = new User({name,email,password:hashed, role});
  await u.save();
  const token = jwt.sign({id:u._id, role: u.role}, process.env.JWT_SECRET, {expiresIn:'7d'});
  res.json({token, user:{id:u._id, name:u.name, email:u.email, role:u.role}});
});

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const {email,password} = req.body;
  const u = await User.findOne({email});
  if(!u) return res.status(400).json({msg:'Invalid credentials'});
  const ok = await bcrypt.compare(password, u.password);
  if(!ok) return res.status(400).json({msg:'Invalid credentials'});
  const token = jwt.sign({id:u._id, role: u.role}, process.env.JWT_SECRET, {expiresIn:'7d'});
  res.json({token, user:{id:u._id, name:u.name, email:u.email, role:u.role}});
});

export default router;
