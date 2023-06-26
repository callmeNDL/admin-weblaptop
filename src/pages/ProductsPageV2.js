import { useEffect, useState } from 'react';
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
import { get, getAuthToken } from '../services/request/request-service';

// ----------------------------------------------------------------------
export default function ProductPageV2() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [dataList, setDataList] = useState([]);
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Tên sản phẩm', width: 340 },
    {
      field: 'image',
      headerName: 'Hinh ảnh',
      minWidth: 150,
      align: 'center',
      flex: 1,
      renderCell: (params) => (
        <div style={{ width: 550, display: 'flex', alignItems: 'center', whiteSpace: 'normal', gap: 10 }}>
          <img
            src={params.row && params.row?.hinhAnhs[0]?.path}
            alt="img-product-cart"
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          />
          
        </div>
      ),
    },
    
    { field: 'brand', headerName: 'Thương hiệu', width: 110 },
    {
      field: 'price',
      headerName: 'Giá',
      type: 'number',
      minWidth: 110,
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
          () => { },
          () => { }
        ),
    },
  ];

  const rows = [
    {
      id: 1,
      name: 'Laptop ASUS Vivobook X515EA-BQ2351W',
      hinhAnhs: [
        {
          path: 'https://lh3.googleusercontent.com/7rvuPBx-BS-q4QXqH1xZF7dLIjpi0__Fw_XV1_qw4GaXepR63JBRKOEOJMwSTL2sui58w_OCuzSpdiiI7BArT27mWduE6Asu=w230-rw',
        },
      ],
      brand: 'ASUS',
      price: '13.990.000vnd',
      active: true,
      count: 15,
    },
    {
      id: 2,
      name: 'Laptop Dell Inspiron 14 5430',
      hinhAnhs: [
        {
          path: 'https://lh3.googleusercontent.com/3rfhB0Gnveqf-bm4tPDcfi3YWi3Pa9cF3ZSTtVf-B4x0uf9_uRTM4eycyMjKbdt8CWAlOtXeJlYZbRXkh_mjbkpg_GMY5HdK=w1000-rw',
        },
      ],
      brand: 'DELL',
      price: '26.000.000vnd',
      active: true,
      count: 8,
    }, 
    {
      id: 3,
      name: 'MacBook Air 2020 13.3 inch',
      hinhAnhs: [
        {
          path: 'https://lh3.googleusercontent.com/Ezh1zisXToaMPP30pXE50dnotXpEyxnGsYpbd6uZc6jEWRWhMrMY2EDuXNcWPhw4nfcwwC-mGGVEkkRtRSJE0P3hRPuvCjw=w500-rw',
        },
      ],
      brand: 'MacBook',
      price: '18.590.000vnd',
      active: true,
      count: 16,
    },
    {
      id: 3,
      name: 'Laptop ASUS TUF Gaming FX706HC',
      hinhAnhs: [
        {
          path: 'https://lh3.googleusercontent.com/T1mBMdtFBtyQs9iLByq1NT4UlKWPa3Wa9W6uBkPC5mLOH7LFpeNS0dcs-Jvofd0QqJoB0WOhLR6Mw5BKaWBkvNtZkvO1hmXs=w500-rw',
        },
      ],
      brand: 'ASUS',
      price: '20.090.000vnd',
      active: true,
      count: 22,
    },
  ]

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('sanpham', {
          headers: {
            Authorization: `Token ${accessToken}`,
          }
        })
        if (res) {
          setDataList(res)
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

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
            Sản phẩm
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setOpen(true);
            }}
          >
            Thêm sản phẩm
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
        <FormDialog
          open={open}
          title="Thêm mới sản phẩm"
          ok="Thêm mới"
          close="Đóng"
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        >
          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField id="name" label="Name" multiline fullWidth />
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
