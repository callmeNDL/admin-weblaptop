// @mui
import { useState } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// components
import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';
import ActionButtons from '../components/action-button/ActionButtons';

// ----------------------------------------------------------------------
export default function UsersPageV2() {
  const [open, setOpen] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 50, align: 'center' },
    {
      field: 'hoTenLot',
      headerName: 'Họ tên lot',
      minWidth: 100,
      align: 'center',
      flex: 1,
    },
    { field: 'ten', headerName: 'Tên', width: 100 },
    {
      field: 'soDienThoai',
      headerName: 'Số điện thoại',
      minWidth: 90,
      flex: 1,
      align: 'center',
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 100,
      flex: 1,
      align: 'center',
    },
    {
      field: 'diaChi',
      headerName: 'Địa chỉ',
      minWidth: 100,
      flex: 1,
      align: 'center',
    },
    {
      field: 'province',
      headerName: 'Thành phố / Tỉnh ',
      minWidth: 100,
      flex: 1,
      align: 'center',
    },
    {
      field: 'district',
      headerName: 'Quận / Huyện ',
      minWidth: 100,
      flex: 1,
      align: 'center',
    },
    {
      field: 'ward',
      headerName: 'Phường ',
      minWidth: 100,
      flex: 1,
      align: 'center',
    },
    {
      field: 'acb',
      headerName: 'Actions',
      minWidth: 120,
      flex: 1,
      align: 'center',
      renderCell: (params) =>
        ActionButtons(
          params.row,
          () => {},
          () => {}
        ),
    },
  ];

  const rows = [
    {
      id: '1',
      active: true,
      hoTenLot: 'Nguyen Quoc',
      ten: 'Huy',
      ngaySinh: '2001-01-14',
      soDienThoai: '0369173417',
      email: 'quochuy.140101@gmail.com',
      diaChi: '1/7 Nguyen Van Yen',
      username: 'admin1',
      password: 'quochuy123',
      createdAt: '',
      updatedAt: '',
      province: 1,
      district: 1,
      ward: 1,
    },
  ];

  const handleClickOpen = () => {
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Người dùng
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setOpen(true);
            }}
          >
            Thêm mới
          </Button>
        </Stack>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight
              disableRowSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              rowHeight={100}
            />
          </div>
        </Stack>
      </Container>
      <FormDialog
        open={open}
        ok="Thêm mới"
        close="Đóng"
        title="Thêm mới sản người dùng"
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      >
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField id="hoTenLot" name="hoTenLot" label="Họ và tên" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id="ten" name="ten" label="Tên" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id="ngaySinh" name="ngaySinh" label="Ngày sinh" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id="soDienThoai" name="soDienThoai" label="Số điện thoại" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id="email" name="email" label="Email" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id="username" name="username" label="username" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Thành phố / Tỉnh</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" label="RAM">
                  <MenuItem value={10}>HCM</MenuItem>
                  <MenuItem value={20}>Hà Nội</MenuItem>
                  <MenuItem value={30}>Long An</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Quận / Huyện</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Thương hiệu">
                  <MenuItem value={10}>1</MenuItem>
                  <MenuItem value={20}>2</MenuItem>
                  <MenuItem value={30}>3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Phường</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" label="CPU">
                  <MenuItem value={10}>12</MenuItem>
                  <MenuItem value={20}>12</MenuItem>
                  <MenuItem value={30}>12</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField id="diaChi" name="diaChi" label="Địa chỉ" fullWidth />
            </Grid>
          </Grid>
        </Box>
      </FormDialog>
    </>
  );
}
