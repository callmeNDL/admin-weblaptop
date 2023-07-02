import { useEffect, useState } from 'react';
// @mui
import { Stack, Button, Container, Typography, TextField, Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
// components
import ActionButtons from '../components/action-button/ActionButtons';
import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';
import { Delete, get, getAuthToken, post, put } from '../services/request/request-service';
import SearchTable from '../components/search/SeachTable';

// ----------------------------------------------------------------------
const ProductsType = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectData, setSelectData] = useState({});
  const [dataList, setDataList] = useState([]);
  const [credentials, setCredentials] = useState({
    tenDanhMuc: '',
    moTa: '',
  });
  const [file, setFile] = useState(null);

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
      renderCell: (params) => (
        <ActionButtons
          handleClickOpen={() => {
            setSelectData(params.row);
            setCredentials(params.row);
            setOpen(true);
          }}
          handleClickDelOpen={() => {
            setSelectData(params.row);
            setOpenDelete(true);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    getList();
    setCredentials({
      tenDanhMuc: '',
      moTa: '',
      ProductsCount:'',
    });
  }, []);

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
        const res = await get('loaisanpham');
        if (res && res.status === 'OK') {
          setDataList(
            res.data.map((item) => {
              return {
                ...item,
                ProductsCount: item.sanPhams.length,
              };
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClickOpen = () => {
    console.log('ok');
  };
  const handleClose = () => {
    setOpen(false);
    setCredentials({
      tenDanhMuc: '',
      moTa: '',
      ProductsCount:'',
    });
  };
  const handleOnChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };
  const handeEdit = () => {
    setOpen(true);
  };
  const handleDelete = async () => {
    try {
      const { accessToken } = await getAuthToken();
      if (accessToken && selectData) {
        const res = await Delete(`loaisanpham/${selectData.id}`, {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res.status === 'OK') {
          getList();
          enqueueSnackbar('Xóa thành công', { variant: 'success' });
          handleDeleteClose();
        } else {
          enqueueSnackbar('Xóa thất bại', { variant: 'error' });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const onSubmit = async (data) => {
    console.log(selectData, 'selectData');
    if (!selectData && !selectData?.id) {
      // truong hop nay la không có seledata nghĩa là mình chưa chọn thằng nào nên n hiểu là taọ mơis
      try {
        if (data) {
          const { accessToken } = await getAuthToken();
          if (accessToken) {
            const res = await post('loaisanpham', data, {
              headers: {
                Authorization: `Token ${accessToken}`,
              },
            });
            if (res?.status === 'OK') {
              getList();
              enqueueSnackbar('Thêm thành công', { variant: 'success' });
              handleClose();
            } else {
              enqueueSnackbar('Thêm thất bại', { variant: 'error' });
            }
          }
        }
      } catch (error) {
        enqueueSnackbar('Thêm thất bại', { variant: 'error' });
        console.log(error);
      }
    } else {
      console.log('AaaAA');

      // ngược lại nếu đẫ chọn 1 thằng rồi thì la cap nhật
      try {
        if (data) {
          const { accessToken } = await getAuthToken();
          if (accessToken) {
            const res = await put(`loaisanpham/${selectData.id}`, 
            {
              tenDanhMuc: credentials.tenDanhMuc,
              moTa: credentials.moTa,
              ProductsCount: credentials.ProductsCount,
            },
            {
              headers: {
                Authorization: `Token ${accessToken}`,
              },
            }
            );
            if (res?.status === 'OK') {
              getList();
              enqueueSnackbar(res?.message, { variant: 'success' });
              handleClose();
            } else {
              enqueueSnackbar('Cập nhật thất bại', { variant: 'error' });
            }
          }
        }
      } catch (error) {
        enqueueSnackbar('Cập nhật thất bại', { variant: 'error' });
        console.log(error);
      }
    }
  };
  // const handleSubmit = async () => {
  //   const { accessToken } = await getAuthToken();
  //   if (accessToken && credentials.moTa !== '' && credentials.tenDanhMuc !== '' && credentials.ProductsCount !== '') {
  //     if (!selectData) {
  //       // selectData truong hop khong co chon data thi n la api them
  //       if (credentials) {
  //         const res = await post('loaisanpham', credentials, {
  //           headers: {
  //             Authorization: `Token ${accessToken}`,
  //           },
  //         });
  //         if (res.status === 'OK') {
  //           getList();
  //           setOpen(false);
  //           enqueueSnackbar('Thêm thành công', { variant: 'success' });
  //           handleClose();
  //         } else {
  //           enqueueSnackbar('Thêm thất bại', { variant: 'error' });
  //         }
  //       }
  //     } else {
  //       const res = await put(
  //         `loaisanpham/${selectData.id}`,
  //         {
  //           tenDanhMuc: credentials.tenDanhMuc,
  //           moTa: credentials.moTa,
  //           ProductsCount: credentials.ProductsCount,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Token ${accessToken}`,
  //           },
  //         }
  //       );
  //       if (res.status === 'OK') {
  //         getList();
  //         enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
  //         handleClose();
  //       } else {
  //         enqueueSnackbar('Cập nhật thất bại', { variant: 'error' });
  //       }
  //     }
  //   }
  // };
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
        <SearchTable>
          <TextField name="tenDanhMuc" label="Tên danh mục" />
        </SearchTable>
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
              rowHeight={80}
            />
          </div>
        </Stack>

        <FormDialog
          open={open}
          title={`${selectData ? 'Cập nhật' : 'Thêm mới'} loại sản phẩm`}
          ok={`${selectData ? 'Cập nhật' : 'Thêm mới'}`}
          close="Đóng"
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          handleSubmit={onSubmit}
        >
          <Box component="form" noValidate autoComplete="off" style={{ marginTop: '10px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  id="tenDanhMuc"
                  value={credentials.tenDanhMuc}
                  onChange={handleChange}
                  name="tenDanhMuc"
                  label="Tên danh mục"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="moTa"
                  value={credentials.moTa}
                  onChange={handleChange}
                  name="moTa"
                  label="Mô tả"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="ProductsCount"
                  value={credentials.ProductsCount}
                  onChange={handleChange}
                  name="ProductsCount"
                  label="Số lượng"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </FormDialog>
        <FormDialog
          open={openDelete}
          title="Bạn có chắc chắn muốn xoá không ?"
          ok="Xoá"
          close="Đóng"
          handleClickOpen={() => {}}
          handleClose={handleDeleteClose}
          handleSubmit={handleDelete}
        >
          <Box component="form" noValidate autoComplete="off" style={{ marginTop: '10px' }}>
            <></>
          </Box>
        </FormDialog>
      </Container>
    </>
  );
};

export default ProductsType;
