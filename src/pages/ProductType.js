import { useEffect, useState } from 'react';
// @mui
import { Stack, Button, Container, Typography, TextField, Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// components
import ActionButtons from '../components/action-button/ActionButtons';

import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';
import { get, getAuthToken } from '../services/request/request-service';

// ----------------------------------------------------------------------
const ProductsType = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [credentials, setCredentials] = useState({
    tenDanhMuc: '',
    moTa: '',
  });
  const [file, setFile] = useState(null);
  const [selectData, setSelectData] = useState({});


  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'tenDanhMuc',
      headerName: 'Tên danh mục',
      minWidth: 150,
      align: 'center',
    },
    {
      field: 'moTa',
      headerName: 'Mô tả',
      minWidth: 300,
      align: 'center',
    },
    {
      field: 'ProductsCount',
      headerName: 'Số lượng sản phẩm',
      minWidth: 150,
      align: 'center',
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

  useEffect(() => {
    getList()
    setCredentials({
      tenDanhMuc: '',
      moTa: '',
    })
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const getList = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('loaisanpham')
        if (res && res.status === 'OK') {
          setDataList(res.data.map((item) => {
            return {
              ...item, ProductsCount: item.sanPhams.length
            }
          }))
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClickOpen = () => {
    console.log("ok");
  };
  const handleClose = () => {
    setOpen(false);
    setCredentials({
      tenDanhMuc: '',
      moTa: '',
    })
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
            Loại sản phẩm
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
              rows={dataList}
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
              rowHeight={80}
            />
          </div>
        </Stack>
        <FormDialog
          open={open}
          title="Thêm loại sản phẩm mới"
          ok="Thêm mới"
          close="Đóng"
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        >
          <Box component="form" noValidate autoComplete="off" style={{ marginTop: '10px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField id="name" value={credentials.tenDanhMuc} onChange={handleChange} name='tenDanhMuc' label="Tên danh mục" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField id="name" value={credentials.moTa} onChange={handleChange} name='moTa' label="Mô tả" fullWidth />
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

export default ProductsType