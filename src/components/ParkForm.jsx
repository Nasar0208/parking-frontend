import { useState } from 'react';
import {
  Box, Button,
  FormControl, InputLabel, Select, MenuItem, TextField, Alert
} from '@mui/material';
import axios from 'axios';

export default function ParkForm({ onSuccess, availableSizes, disabled }) {
  const [plate, setPlate] = useState('');
  const [size, setSize]   = useState('');
  const [msg, setMsg]     = useState(null);

  const submit = async () => {
    setMsg(null);
    if (!plate.trim()) {
      setMsg({type:'error',text:'Plate required.'});
      return;
    }
    if (!size) {
      setMsg({type:'error',text:'Size required.'});
      return;
    }
    try {
      const res = await axios.post('http://localhost:8080/api/parking/park', {
        licensePlate:plate.trim(), size
      });
      setMsg({type:'success',text:`Parked at slot ${res.data.slot}`});
      setPlate(''); setSize('');
      onSuccess();
    } catch (e) {
      setMsg({type:'error',text:e.response?.data || 'Something went wrong'});
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <TextField
        label="Plate" value={plate}
        onChange={e=>setPlate(e.target.value)}
        disabled={disabled}
      />
      <FormControl sx={{minWidth:120}} disabled={disabled||!availableSizes.length}>
        <InputLabel>Size</InputLabel>
        <Select
          value={size} label="Size"
          onChange={e=>setSize(e.target.value)}
        >
          {availableSizes.map(s =>
            <MenuItem key={s} value={s}>{s}</MenuItem>
          )}
        </Select>
      </FormControl>
      <Button variant="contained"
        onClick={submit}
        disabled={disabled||!availableSizes.length}
      >
        Park
      </Button>
      {msg && <Alert severity={msg.type}>{msg.text}</Alert>}
    </Box>
  );
}
