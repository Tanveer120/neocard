import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Product from "./Product";
import { DataGrid } from "@mui/x-data-grid";
import API from '../../../api/client';
import { Box, Button } from '@mui/material';
import AddProductModal from './AddProductModal';
export default function Products() {
  const [rows, setRows] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  useEffect(()=>{
    let mounted = true;
    API.get('/products').then(res=>{ if(mounted) setRows(res.data.map(r=>({id:r._id, ...r}))) }).catch(()=>{});
    return ()=> mounted = false;
  },[]);

  const refresh = ()=> API.get('/products').then(res=> setRows(res.data.map(r=>({id:r._id, ...r}))).catch(()=>{}));

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      description: "id of the product",
    },
    {
      field: "product",
      headerName: "Product",
      width: 400,
      description: "",
      //same here we have the cell data which i will get the value of the cells in the tables cellData.row.fieldName

      renderCell: (cellData) => {
        console.log("the cell data is : ", cellData.row.name);
        return <Product productName={cellData.row.name} />;
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      description: "category of the product",
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      description: "price of the product",
      valueGetter: (params) => "$" + params.row.stock,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 200,
      description: "how many items in the stock",
      valueGetter: (params) => params.row.stock + " pcs",
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const p = params.row;
        return (
          <Box>
            <Button size="small" sx={{mr:1}} onClick={()=> handleEdit(p)}>Edit</Button>
            <Button size="small" color="error" onClick={()=> handleDelete(p)}>Delete</Button>
          </Box>
        );
      }
    }
  ];

  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (p)=>{
    setEditingProduct(p);
    setOpenAdd(true);
  }

  const handleDelete = async (p)=>{
    if(!confirm(`Delete product ${p.name}?`)) return;
    try{
      await API.delete(`/products/${p._id}`);
      refresh();
    }catch(e){
      alert('Delete failed');
    }
  }

  return (
    <div>
      <Box sx={{display:'flex', justifyContent:'flex-end', mb:2}}>
        <Button variant="contained" onClick={()=> setOpenAdd(true)}>Add Product</Button>
      </Box>
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />
  <AddProductModal product={editingProduct} open={openAdd} onClose={()=> { setOpenAdd(false); setEditingProduct(null); }} onAdded={(p)=> { setEditingProduct(null); refresh(); }} />
    </div>
  );
}
