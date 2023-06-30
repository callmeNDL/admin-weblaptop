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
  Input,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';

import { DataGrid } from '@mui/x-data-grid';
import Iconify from '../components/iconify';

import FormDialog from '../components/formDialog/FormDialog';
import { Delete, get, getAuthToken, post, put } from '../services/request/request-service';
import ActionButtons from '../components/action-button/ActionButtons';
import FormDialogSubmit from '../components/formDialog/FormDialogSubmit';

// ----------------------------------------------------------------------
export default function Brand() {
  const [open, setOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectData, setSelectData] = useState({});

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      tenNhaSanXuat: '',
      moTa: '',
      
    },
  });
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'tenNhaSanXuat',
      headerName: 'Tên thương hiệu',
      minWidth: 200,
      align: 'center',
    },
    // {
    //   field: 'image',
    //   headerName: 'Hinh ảnh',
    //   width: 200,
    //   align: 'center',
    //   renderCell: (params) => (
    //     <div style={{ width: 450, display: 'flex', alignItems: 'center', whiteSpace: 'normal', gap: 10 }}>
    //       <img
    //         src={params.row && params.row?.hinhAnhs[0]?.path}
    //         alt="img-product-cart"
    //         style={{ width: '100%', height: '100px', objectFit: 'cover' }}
    //       />
    //     </div>
    //   ),
    // },
    {
      field: 'moTa',
      headerName: 'Mô tả',
      minWidth: 400,
      align: 'center',
    },
    {
      field: 'acb',
      headerName: 'Actions',
      minWidth: 100,
      align: 'center',
      renderCell: (params) => (
        <ActionButtons
          handleClickOpen={() => {
            // set gia tri muon update (daang chon)
            setSelectData(params.row);
            reset(params.row);
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

  // const rows = [
  //   {
  //     id: 1,
  //     hinhAnhs: [
  //       {
  //         path: 'https://lh3.googleusercontent.com/_85FkTsaqoVl-I6d5pN9jrE7jHrz1hzXQktSqWNrLmeIMaWB-wxsE6D_IyDC414BXjRM54JXbZzGQy8rFsz0-zWkVG4V6CuXHw=w400-rw',
  //       },
  //     ],
  //     brand: 'HP',
  //     price: '24000000',
  //     active: true,
  //     count: 15,
  //   },
  //   {
  //     id: 2,
  //     hinhAnhs: [
  //       {
  //         path: 'https://lh3.googleusercontent.com/IqFtu_Hq7dQkOuTjKwVTjKV5Z1qK3FsuX3yX6Ab30i_yXZ2B1dFs8uQwQ9zgTt3UZts3RnuYx-ujvQW0i5Ox2UDhrqxeehI=w400-rw',
  //       },
  //     ],
  //     brand: 'ASUS',
  //     price: '20000000',
  //     active: true,
  //     count: 5,
  //   },
  //   {
  //     id: 3,
  //     hinhAnhs: [
  //       {
  //         path: 'https://cdn.redmondpie.com/wp-content/uploads/2015/03/Apple-event-banners-main.png',
  //       },
  //     ],
  //     brand: 'APPLE',
  //     price: '21000000',
  //     active: true,
  //     count: 10,
  //   },
  // ];
  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('nhasanxuat', {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res?.status === 'OK') {
          setDataList(res.data);
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
    setSelectData('');
    reset({
      tenNhaSanXuat: '',
      moTa: '',      
    });
  };
  const onSubmit = async (data) => {
    if (!selectData) {
      // truong hop nay la không có seledata nghĩa là mình chưa chọn thằng nào nên n hiểu là taọ mơis
      try {
        if (data) {
          const { accessToken } = await getAuthToken();
          if (accessToken) {
            const res = await post('nhasanxuat', data, {
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
        enqueueSnackbar('Cập nhật thất bại', { variant: 'error' });
        console.log(error);
      }
    } else {
      // ngược lại nếu đẫ chọn 1 thằng rồi thì la cap nhật
      try {
        if (data) {
          const { accessToken } = await getAuthToken();
          if (accessToken) {
            const res = await put(`nhasanxuat/${selectData.id}`, data, {
              headers: {
                Authorization: `Token ${accessToken}`,
              },
            });
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
  
  const handeEdit = () => {
    setOpen(true);
  };
  const handleDelete = async () => {
    try {
      const { accessToken } = await getAuthToken();
      if (accessToken && selectData) {
        // call api delete
        const res = await Delete(`nhasanxuat/${selectData.id}`, {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res?.status === 'OK') {
          getList();
          enqueueSnackbar(res?.message, { variant: 'success' });
          handleDeleteClose();
        } else {
          enqueueSnackbar('Khóa thất bại', { variant: 'error' });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteClickOpen = () => {
    console.log('acb');
    setOpenDelete(false);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
    setSelectData('');
  };
  console.log(selectData, 'ADAD');
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
              rowHeight={150}
            />
          </div>
        </Stack>
        <FormDialogSubmit open={open} title="Cập nhật nhà sản xuất">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="tenNhaSanXuat"
                  {...register('tenNhaSanXuat', { required: 'Nhập tên nhà sản xuất' })}
                  label="Tên nhà sản xuất"
                  fullWidth
                  error={!!errors.tenNhaSanXuat}
                  helperText={errors.tenNhaSanXuat?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="moTa"
                  {...register('moTa', { required: 'Nhập mô tả ' })}
                  label="Mô tả"
                  fullWidth
                  
                  error={!!errors.moTa}
                  helperText={errors.moTa?.message}
                />
              </Grid>
             
              
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
              <Button onClick={handleClose}>Đóng</Button>
              <Button type="submit">Hoàn tất</Button>
            </div>
          </form>
        </FormDialogSubmit>
        <FormDialog
          open={openDelete}
          title="Bạn có chắc chắn muốn khóa không ?"
          ok="Xoá"
          close="Khóa"
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
}
