import React, {useState} from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/useAuth';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const auth = useAuth();
  const nav = useNavigate();

  const submit = async ()=>{
    try{
      await auth.login(email,password);
      nav('/home');
    }catch(e){
      setErr(e.response?.data?.msg || 'Login failed');
    }
  }

  return (
    <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', height:'80vh'}}>
      <Box sx={{width:360, p:4, bgcolor:'white', borderRadius:2}}>
        <Typography variant="h6" sx={{mb:2}}>Sign in</Typography>
        <TextField label="Email" fullWidth value={email} onChange={e=>setEmail(e.target.value)} sx={{mb:2}} />
        <TextField label="Password" type="password" fullWidth value={password} onChange={e=>setPassword(e.target.value)} sx={{mb:2}} />
        {err && <Typography color="error" sx={{mb:2}}>{err}</Typography>}
        <Button variant="contained" fullWidth onClick={submit}>Sign in</Button>
      </Box>
    </Box>
  );
}
