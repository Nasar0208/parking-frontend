import { DataGrid } from '@mui/x-data-grid';

export default function SlotTable({ rows }) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={[
          { field: 'id',       headerName: 'Slot',     width:  80 },
          { field: 'size',     headerName: 'Size',     width: 120 },
          { field: 'occupied', headerName: 'Occupied', width: 120 },
          { field: 'plate',    headerName: 'Plate',    width: 150 },
        ]}
        pageSizeOptions={[10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } }
        }}
        pagination
      />
    </div>
  );
}
