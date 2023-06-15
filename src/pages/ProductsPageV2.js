import { useState } from 'react';
// @mui
import {
  Stack,
  Button,
  Container,
  Typography,
  TextField,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// components
import ActionButtons from '../components/action-button/ActionButtons';

import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';

// ----------------------------------------------------------------------
export default function ProductPageV2() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Tên sản phẩm',
      minWidth: 400,
      align: 'center',
      flex: 1,
      renderCell: (params) => (
        <div style={{ width: 450, display: 'flex', alignItems: 'center', whiteSpace: 'normal', gap: 10 }}>
          <img
            src={params.row && params.row?.hinhAnhs[0]?.path}
            alt="img-product-cart"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <div>
            <div>{params.row.name}</div>
          </div>
        </div>
      ),
    },
    { field: 'brand', headerName: 'Thương hiệu', width: 110 },
    {
      field: 'price',
      headerName: 'Giá',
      type: 'number',
      minWidth: 90,
      align: 'center',
    },
    {
      field: 'count',
      headerName: 'Số lượng',
      sortable: false,
      minWidth: 100,
      align: 'center',
    },
    {
      field: 'acb',
      headerName: 'Actions',
      minWidth: 100,
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
      id: 1,
      hinhAnhs: [
        {
          path: 'https://lh3.googleusercontent.com/IUHZL9DwyhlhuK7FUW5PFkb0cF4C9-3YHgfe9fOWGyYXhKXhXG_SE1Yq_Gde37zqjIYXu7MbflLvR7NfED0LOxHZidr-iXSHnA=w500-rw',
        },
      ],
      name: 'Laptop APPLE MacBook Pro 14" (Apple M2/RAM 16GB/512GB SSD/ macOS)',
      brand: 'APPLE',
      price: '24000000',
      active: true,
      count: 15,
    },
    {
      id: 2,
      hinhAnhs: [
        {
          path: 'https://lh3.googleusercontent.com/qgVwPKOgCXFJjAO-HB7Su5OPg7sBv4pJj9hTJxdvuz7GlWzA4gVaIC19oasGWcjIUgbqwZBpH1_OkTjyj_M=w500-rw',
        },
      ],
      name: 'Laptop APPLE MacBook Pro 14" (Apple M2/RAM 16GB/512GB SSD/ macOS)',
      brand: 'APPLE',
      price: '20000000',
      active: true,
      count: 5,
    },
    {
      id: 3,
      hinhAnhs: [
        {
          path: 'https://lh3.googleusercontent.com/0Ho5t1AcaewiaKYlBgF8ks8oWZ8cqu50yANPyrBSGqrvFO03gfHo_LgSxPi8Afy2ksXoP337jgcCf8e2TQ=w500-rw',
        },
      ],
      name: 'Laptop APPLE MacBook Pro 14" (Apple M2/RAM 16GB/512GB SSD/ macOS)',
      brand: 'APPLE',
      price: '21000000',
      active: true,
      count: 10,
    },
  ];
  const handleClickOpen = () => {
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOnChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Userv2
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setOpen(true);
            }}
          >
            New User
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
        <FormDialog open={open} title="Thêm mới sản phẩm" handleClickOpen={handleClickOpen} handleClose={handleClose}>
          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField id="name" label="Name" multiline rows={2} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField id="price" label="Giá" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">RAM</InputLabel>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" label="RAM">
                    <MenuItem value={10}>Apple</MenuItem>
                    <MenuItem value={20}>MSI</MenuItem>
                    <MenuItem value={30}>DELL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Thương hiệu</InputLabel>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Thương hiệu">
                    <MenuItem value={10}>Apple</MenuItem>
                    <MenuItem value={20}>MSI</MenuItem>
                    <MenuItem value={30}>DELL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">CPU</InputLabel>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" label="CPU">
                    <MenuItem value={10}>Apple</MenuItem>
                    <MenuItem value={20}>MSI</MenuItem>
                    <MenuItem value={30}>DELL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Thương hiệu</InputLabel>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Thương hiệu">
                    <MenuItem value={10}>Apple</MenuItem>
                    <MenuItem value={20}>MSI</MenuItem>
                    <MenuItem value={30}>DELL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Đồ họa</InputLabel>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Đồ họa">
                    <MenuItem value={10}>Apple</MenuItem>
                    <MenuItem value={20}>MSI</MenuItem>
                    <MenuItem value={30}>DELL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Đồ họa</InputLabel>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Đồ họa">
                    <MenuItem value={10}>Apple</MenuItem>
                    <MenuItem value={20}>MSI</MenuItem>
                    <MenuItem value={30}>DELL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Lưu trữ</InputLabel>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Lưu trữ">
                    <MenuItem value={10}>Apple</MenuItem>
                    <MenuItem value={20}>MSI</MenuItem>
                    <MenuItem value={30}>DELL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={9}>
                <TextField id="name" label="Hình ảnh" fullWidth disabled value={file ? file?.name : ''} />
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" component="label" style={{ height: '100%' }}>
                  Upload File
                  <input type="file" hidden onChange={handleOnChange} />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </FormDialog>
      </Container>
    </>
  );
}
