import { useState } from 'react';
import {
  Box, Button,
  FormControl, InputLabel, Select, MenuItem, Alert
} from '@mui/material';
import axios from 'axios';

export default function LeaveForm({ onSuccess, plates, disabled }) {
  const [plate, setPlate] = useState('');
  const [msg, setMsg]     = useState(null);

  const submit = async () => {
    setMsg(null);
    if (!plate) {
      setMsg({type:'error',text:'Select a plate.'});
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/parking/leave', { licensePlate: plate });
      setMsg({type:'success',text:'Vehicle left.'});
      setPlate('');
      onSuccess();
    } catch (e) {
      setMsg({type:'error',text:e.response?.data || 'Something went wrong'});
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <FormControl sx={{minWidth:140}} disabled={disabled||!plates.length}>
        <InputLabel>Plate</InputLabel>
        <Select
          value={plate}
          label="Plate"
          onChange={e=>setPlate(e.target.value)}
        >
          {plates.map(p =>
            <MenuItem key={p} value={p}>{p}</MenuItem>
          )}
        </Select>
      </FormControl>
      <Button variant="contained" color="warning"
        onClick={submit}
        disabled={disabled||!plates.length}
      >
        Leave
      </Button>
      {msg && <Alert severity={msg.type}>{msg.text}</Alert>}
    </Box>
  );
}
