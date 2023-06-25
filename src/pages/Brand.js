import { useState } from 'react';
// @mui
import { Stack, Button, Container, Typography, TextField, Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// components
import ActionButtons from '../components/action-button/ActionButtons';

import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';

// ----------------------------------------------------------------------
export default function Brand() {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [credentials, setCredentials] = useState({
    tenDanhMuc: '',
    moTa: '',
  });
  
  const [selectData, setSelectData] = useState({});
  const [file, setFile] = useState(null);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'brand',
      headerName: 'Tên thương hiệu',
      minWidth: 200,
      align: 'center',
    },
    {
      field: 'image',
      headerName: 'Hinh ảnh',
      width: 200,
      align: 'center',
      renderCell: (params) => (
        <div style={{ width: 450, display: 'flex', alignItems: 'center', whiteSpace: 'normal', gap: 10 }}>
          <img
            src={params.row && params.row?.hinhAnhs[0]?.path}
            alt="img-product-cart"
            style={{ width: '100%', height: '100px', objectFit: 'cover' }}
          />
        </div>
      ),
    },
    {
      field: 'action',
      headerName: 'Actions',
      minWidth: 100,
      align: 'center',
      renderCell: (params) =>
        <ActionButtons
          handleClickOpen={() => {
            setSelectData(params.row)
            setCredentials(params.row)
            setOpen(true)
          }}
          handleClickDelOpen={() => {
            setSelectData(params.row)
          }}

        />

    },
  ];

  const rows = [
    {
      id: 1,
      hinhAnhs: [
        {
          path: 'https://lh3.googleusercontent.com/_85FkTsaqoVl-I6d5pN9jrE7jHrz1hzXQktSqWNrLmeIMaWB-wxsE6D_IyDC414BXjRM54JXbZzGQy8rFsz0-zWkVG4V6CuXHw=w400-rw',
        },
      ],
      brand: 'HP',
      price: '24000000',
      active: true,
      count: 15,
    },
    {
      id: 2,
      hinhAnhs: [
        {
          path: 'https://lh3.googleusercontent.com/IqFtu_Hq7dQkOuTjKwVTjKV5Z1qK3FsuX3yX6Ab30i_yXZ2B1dFs8uQwQ9zgTt3UZts3RnuYx-ujvQW0i5Ox2UDhrqxeehI=w400-rw',
        },
      ],
      brand: 'ASUS',
      price: '20000000',
      active: true,
      count: 5,
    },
    {
      id: 3,
      hinhAnhs: [
        {
          path: 'https://cdn.redmondpie.com/wp-content/uploads/2015/03/Apple-event-banners-main.png',
        },
      ],
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
  const handeEdit = () => {
    setOpen(true);
  };
  const handleDeleteClickOpen = () => {
    console.log('acb');
    setOpenDelete(false);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Thương hiệu
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
              rowHeight={150}
            />
          </div>
        </Stack>
        <FormDialog
          open={open}
          title="Thêm nhà sản xuất mới"
          ok="Thêm mới"
          close="Đóng"
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        >
          <Box component="form" noValidate autoComplete="off" style={{ marginTop: '10px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField id="name" label="Tên thương hiệu" fullWidth />
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
        <FormDialog
          open={openDelete}
          title="Bạn có chắc chắn muốn xoá không ?"
          ok="Xoá"
          close="Đóng"
          handleClickOpen={handleDeleteClickOpen}
          handleClose={handleDeleteClickOpen}
        >
          <Box component="form" noValidate autoComplete="off" style={{ marginTop: '10px' }}>
            <></>
          </Box>
        </FormDialog>
      </Container>
    </>
  );
}
