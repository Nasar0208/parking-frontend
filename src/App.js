import {   Container, Typography,Divider,Box,Button } from '@mui/material';
import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import CreateLotForm from './components/CreateLotForm';
import ParkForm      from './components/ParkForm';
import LeaveForm     from './components/LeaveForm';
import SlotTable     from './components/SlotTable';

export default function App() {
  const [rows, setRows] = useState([]);
  const [created, setCreated]   = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/parking/status');
      const newRows = res.data.map(s => ({
        id: s.id,
        size: s.size,
        occupied: s.occupied,
        plate: s.currentVehicle?.licensePlate || ''
      }));
      setRows(newRows);
      setCreated(newRows.length > 0);
    } catch (err) {
      console.error('Failed to fetch status', err);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const freeSizes = Array.from(
    new Set(rows.filter(r=>!r.occupied).map(r=>r.size))
  );
  const occupiedPlates = rows
    .filter(r=>r.occupied)
    .map(r=>r.plate);

  const handleReset = async () => {
    await axios.post('http://localhost:8080/api/parking/reset');
    setCreated(false);
    setRows([]);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4"> Nasar's Parking Lot Dashboard</Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleReset}
          disabled={!created}
        >
          Reset
        </Button>
      </Box>

      <Box sx={{ my: 2 }}>
        <CreateLotForm
          onSuccess={() => { setCreated(true); fetchStatus(); }}
          disabled={created}
        />
      </Box>

      <Divider/>

      <Box sx={{ my: 3, display: 'flex', gap: 10 }}>
        <ParkForm
          onSuccess={fetchStatus}
          availableSizes={freeSizes}
          disabled={!created}
        />
        <LeaveForm
          onSuccess={fetchStatus}
          plates={occupiedPlates}
          disabled={!created}
        />
      </Box>

      <Divider/>

      <Box sx={{ my: 2 }}>
        <SlotTable rows={rows}/>
      </Box>
    </Container>
  );
}
