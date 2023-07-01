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
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';
import { Delete, get, getAuthToken, post, put } from '../services/request/request-service';
import ActionButtons from '../components/action-button/ActionButtons';
import FormDialogSubmit from '../components/formDialog/FormDialogSubmit';
  
// ----------------------------------------------------------------------

  export default function Promo() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectData, setSelectData] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const handleOnChangeUpload = (event) => {
          const file = event.target.files[0];
          setSelectedFile(file);
        };}
        const {
          register,
          reset,
          formState: { errors },
          handleSubmit,
        } = useForm({
          defaultValues: {
            name: '',
            percentDiscount:'',
            description:'',
            createDate: '',
            closeDate:'',            
            active: '',
          },
        });
    const columns = [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'name', headerName: 'Tên danh mục', width: 200 },
      // {
      //   field: 'hinhAnh',
      //   headerName: 'Hinh ảnh',
      //   minWidth: 150,
      //   align: 'center',
      //   flex: 1,
      //   renderCell: (params) => (
      //     <div style={{ width: 550, display: 'flex', alignItems: 'center', whiteSpace: 'normal', gap: 10 }}>
      //       <img
      //         src={params.row && params.row?.hinhAnh[0]?.path}
      //         alt="img-product-cart"
      //         style={{ width: '300px', height: '100px', objectFit: 'cover' }}
      //       />
            
      //     </div>
      //   ),
      // },
      
      { field: 'percentDiscount', headerName: 'Giảm giá', width: 110,align: 'center' },
      { field: 'createDate', headerName: 'Ngày đăng', width: 110,align: 'center' },
      { field: 'description', headerName: 'Mô tả', width: 110,align: 'center' },
      { field: 'closeDate', headerName: 'Ngày kết thúc', width: 110,align: 'center' },
      
      {
        field: 'active',
        headerName: 'Trạng thái',
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
  
    // const rows = [
    //   {
    //     id: 1,
    //     name: 'Banner 1',
    //     hinhAnhs: [
    //       {
    //         path: 'https://lh3.googleusercontent.com/qOrBIQw0fujbab_5ucewKpvInlZBpo9wt0QDrryM58ijaKH74xIfvD_haJentCJuYNk9lSxygBaLOUWpL2hjtaZseAlU-Lkp=w1920-rw',
    //       },
    //     ],
    //     createDate: '14-05-2023',
    //     active: true,        
    //   },
    //   {
    //     id: 2,
    //     name: 'Banner 2',
    //     hinhAnhs: [
    //       {
    //         path: 'https://lh3.googleusercontent.com/vkMMX2cvl_1ii0c_vw5TGy4ixhRc-l7OlMWnmx4-oxquqHo_A9aET_lWxDmxbh-GMZTr3O5JS4kGNa0Ka7hcctxo2lj0xoUR=w1920-rw',
    //       },
    //     ],
    //     createDate: '26-05-2023',
    //     active: true,        
    //   },
    //   {
    //     id: 3,
    //     name: 'Banner 3',
    //     hinhAnhs: [
    //       {
    //         path: 'https://lh3.googleusercontent.com/xeJtVH_tnMI4yiWQlonzDKxct9ZVaDFsV4MBaG7UcXIVGO-SVK54g5zBU-uymbOF-Eob9Dt16tzEfAHLgAQAT_4BORa4JOarNQ=w1920-rw',
    //       },
    //     ],
    //     createDate: '28-05-2023',
    //     active: true,        
    //   },
    // ]
  
    useEffect(() => {
      getList()
    }, [])
  
    const getList = async () => {
      const { accessToken } = await getAuthToken();
      if (accessToken) {
        try {
          const res = await get('khuyenmai', {
            headers: {
              Authorization: `Token ${accessToken}`,
            }
          })
          if (res?.status === 'OK') {
            setDataList(res.data)
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
  
    const handleClickOpen = () => {
      setOpen(false);
      setSelectData('');
      reset({
            name: '',
            percentDiscount:'',
            description:'',
            createDate: '',
            closeDate:'',            
            active: '',
      });
    };
    const handleClose = () => {
      setOpen(false);
      setSelectData('');
      reset({
            name: '',
            percentDiscount:'',
            description:'',
            createDate: '',
            closeDate:'',            
            active: '',
    });
    };
    const handleOnChange = (e) => {
      console.log(e.target.files[0]);
      setFile(e.target.files[0]);
    };
    const onSubmit = async (data) => {
      if (!selectData) {
        
        try {
          if (data) {
            const { accessToken } = await getAuthToken();
            if (accessToken) {
              const res = await post('khuyenmai', data, {
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
        
        try {
          if (data) {
            const { accessToken } = await getAuthToken();
            if (accessToken) {
              const res = await put(`khuyenmai/${selectData.id}`, data, {
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
    const handleDeleteClose = () => {
      setOpenDelete(false);
      setSelectData('');
    };
    const handleDelete = async () => {
      try {
        const { accessToken } = await getAuthToken();
        if (accessToken && selectData) {
          // call api delete
          const res = await Delete(`khuyenmai/${selectData.id}`, {
            headers: {
              Authorization: `Token ${accessToken}`,
            },
          });
          if (res?.status === 'OK') {
            getList();
            enqueueSnackbar(res?.message, { variant: 'success' });
            handleDeleteClose();
          } else {
            enqueueSnackbar('Xóa thất bại', { variant: 'error' });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    console.log(selectData, 'ADAD');
    return (
      <>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Khuyến mãi
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setOpen(true);
              }}
            >
              Thêm danh mục
            </Button>
          </Stack>
          <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={dataList ?? []}
                columns={columns}
                autoHeight
                disableRowSelectionOnClick
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}                
                rowHeight={100}
              />
            </div>
          </Stack>
          <FormDialogSubmit open={open} title="Cập nhật khuyến mãi">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  {...register('name', { required: 'Nhập tên danh mục' })}
                  label="Tên danh mục"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="percentDiscount"
                  {...register('percentDiscount', { required: 'Nhập tỉ lệ giảm giá' })}
                  label="Nhập tỉ lệ giảm giá"
                  fullWidth
                  // type="email"
                  error={!!errors.percentDiscount}
                  helperText={errors.percentDiscount?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  {...register('description', { required: 'Nhập mô tả' })}
                  label="Nhập mô tả"
                  fullWidth
                  // type="email"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  name="createDate"
                  {...register('createDate', { required: 'Ngày đăng' })}
                  label="Ngày đăng"
                  fullWidth
                  type="email"
                  error={!!errors.createDate}
                  helperText={errors.createDate?.message}
                />
              </Grid> */}
              <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Ngày đăng"
                      value={selectedDate}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField
                          name="createDate"
                          {...register('createDate', { required: 'Ngày đăng' })}
                          {...params}
                          fullWidth
                          error={!!errors.createDate}
                          helperText={errors.createDate?.message}
                        />
                      )}
                    />
                  </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Ngày kết thúc"
                      value={selectedDate}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField
                          name="closeDate"
                          {...register('closeDate', { required: 'Ngày kết thúc' })}
                          {...params}
                          fullWidth
                          error={!!errors.closeDate}
                          helperText={errors.closeDate?.message}
                        />
                      )}
                    />
                  </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="active"
                  {...register('active', { required: 'Nhập trạng thái' })}
                  label="Nhập trạng thái"
                  fullWidth
                  // type="email"
                  error={!!errors.active}
                  helperText={errors.active?.message}
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
  