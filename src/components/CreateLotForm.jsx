import { useState,useEffect  } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

const MAX = 2147483647; // Per java Integer.MAX_VALUE

export default function CreateLotForm({ onSuccess, disabled }) {
  const [v, setV]   = useState({ total:'', small:'', large:'', oversize:'' });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!disabled) {
    setV({ total:'', small:'', large:'', oversize:'' });
      setMsg(null);
    }
  }, [disabled]);

  const handleChange = e => {
    if (/^\d*$/.test(e.target.value)) {
      setV({...v, [e.target.name]: e.target.value});
    }
  };

  const submit = async () => {
    setMsg(null);
    const { total, small, large, oversize } = v;
    if ([total,small,large,oversize].some(x=>x==='')) {
      setMsg({type:'error',text:'All fields required.'});
      return;
    }
    const t=+total, s=+small, l=+large, o=+oversize;
    if (t>MAX||s>MAX||l>MAX||o>MAX) {
      setMsg({type:'error',text:`Max possible lots : ${MAX}.`});
      return;
    }
    if (s+l+o!==t) {
      setMsg({type:'error',text:'Total must equal sum of small+large+oversize.'});
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/parking/create', { total:t, small:s, large:l, oversize:o });
      setMsg({type:'success',text:'Lot created!'});
      onSuccess();
    } catch (e) {
      setMsg({type:'error',text:e.response?.data || 'Something went wrong'});
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {['total','small','large','oversize'].map(name=>(
        <TextField key={name}
          name={name}
          label={name.charAt(0).toUpperCase()+name.slice(1)}
          value={v[name]}
          onChange={handleChange}
          disabled={disabled}
          inputProps={{ inputMode:'numeric', pattern:'[0-9]*' }}
        />
      ))}
      <Button
        variant="contained"
        onClick={submit}
        disabled={disabled}
      >
        Create
      </Button>
      {msg && <Alert severity={msg.type}>{msg.text}</Alert>}
    </Box>
  );
}
