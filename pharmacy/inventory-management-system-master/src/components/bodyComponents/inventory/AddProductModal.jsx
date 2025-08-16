import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';
import API from '../../../api/client';
import { useAuth } from '../../../api/useAuth';

export default function AddProductModal({ open, onClose, onAdded, product }){
  const auth = useAuth();
  const [form, setForm] = useState({ sku:'', name:'', description:'', category:'', price:'', cost:'', quantity:'', reorderLevel:'', supplier:'', expiryDate:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(()=>{
    if(product){
      setForm({
        sku: product.sku||'',
        name: product.name||'',
        description: product.description||'',
        category: product.category||'',
        price: product.price||'',
        cost: product.cost||'',
        quantity: product.quantity||'',
        reorderLevel: product.reorderLevel||'',
        supplier: product.supplier||'',
        expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().slice(0,10) : ''
      });
    } else {
      setForm({ sku:'', name:'', description:'', category:'', price:'', cost:'', quantity:'', reorderLevel:'', supplier:'', expiryDate:'' });
    }
  },[product, open]);

  const change = (k) => (e) => setForm(f=> ({...f, [k]: e.target.value}));

  const submit = async ()=>{
    setError('');
    if(!form.sku || !form.name || !form.price) { setError('SKU, name and price are required'); return; }
    const payload = {
      sku: form.sku,
      name: form.name,
      description: form.description,
      category: form.category,
      price: parseFloat(form.price) || 0,
      cost: parseFloat(form.cost) || 0,
      quantity: parseInt(form.quantity) || 0,
      reorderLevel: parseInt(form.reorderLevel) || 0,
      supplier: form.supplier || undefined,
      expiryDate: form.expiryDate ? new Date(form.expiryDate) : undefined
    };
    try{
      setLoading(true);
      let res;
      if(product && product._id){
        res = await API.put(`/products/${product._id}`, payload);
      }else{
        const endpoint = auth?.user ? '/products' : '/products/public';
        res = await API.post(endpoint, payload);
      }
      setLoading(false);
      onAdded && onAdded(res.data);
      onClose();
    }catch(e){
      setLoading(false);
      setError(e.response?.data?.msg || e.message || 'Failed to add');
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{mt:1}}>
          <Grid item xs={12} sm={6}><TextField label="SKU" value={form.sku} onChange={change('sku')} fullWidth /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Name" value={form.name} onChange={change('name')} fullWidth /></Grid>
          <Grid item xs={12}><TextField label="Description" value={form.description} onChange={change('description')} fullWidth/></Grid>
          <Grid item xs={12} sm={4}><TextField label="Category" value={form.category} onChange={change('category')} fullWidth/></Grid>
          <Grid item xs={12} sm={4}><TextField label="Price" value={form.price} onChange={change('price')} fullWidth type="number"/></Grid>
          <Grid item xs={12} sm={4}><TextField label="Cost" value={form.cost} onChange={change('cost')} fullWidth type="number"/></Grid>
          <Grid item xs={12} sm={4}><TextField label="Quantity" value={form.quantity} onChange={change('quantity')} fullWidth type="number"/></Grid>
          <Grid item xs={12} sm={4}><TextField label="Reorder Level" value={form.reorderLevel} onChange={change('reorderLevel')} fullWidth type="number"/></Grid>
          <Grid item xs={12} sm={4}><TextField label="Supplier" value={form.supplier} onChange={change('supplier')} fullWidth/></Grid>
          <Grid item xs={12} sm={6}><TextField label="Expiry Date" value={form.expiryDate} onChange={change('expiryDate')} fullWidth type="date" InputLabelProps={{ shrink: true }} /></Grid>
          {error && <Grid item xs={12}><div style={{color:'red'}}>{error}</div></Grid>}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={loading}>{product ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}
