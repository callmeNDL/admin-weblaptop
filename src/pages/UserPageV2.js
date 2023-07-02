// @mui
import { useEffect, useState } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  FormControl,
  MenuItem,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { enqueueSnackbar } from 'notistack';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

// components
import SearchTable from '../components/search/SeachTable';
import Iconify from '../components/iconify';
import ActionButtons from '../components/action-button/ActionButtons';
import { Delete, get, getAuthToken, post } from '../services/request/request-service';
import FormDialogSubmit from '../components/formDialog/FormDialogSubmit';
import FormDialog from '../components/formDialog/FormDialog';
// ----------------------------------------------------------------------

const defaultValues = {
  hoTenLot: '',
  Ten: '',
  email: '',
  username: '',
  soDienThoai: '',
  province: '',
  district: '',
  ward: '',
  diaChi: '',
  password: '',

};
export default function UsersPageV2() {
  const [open, setOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [district, setDistrict] = useState([]);
  const [startDate, setStartDate] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [ward, setWard] = useState([]);
  const {
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues
  });
  const [province, setProvince] = useState([]);
  const [selectData, setSelectData] = useState([]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 50, align: 'center' },
    {
      field: 'hoTenLot',
      headerName: 'Họ tên lót',
      minWidth: 150,
      align: 'center',
      flex: 1,
    },
    {
      field: 'ten',
      headerName: 'Tên',
      width: 100,
      align: 'center',
      flex: 1
    },
    {
      field: 'soDienThoai',
      headerName: 'Số điện thoại',
      minWidth: 120,
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
      renderCell: (params) => <div>{params.row.province.name}</div>,
    },
    {
      field: 'active',
      headerName: 'Trạng thái',
      type: 'number',
      minWidth: 160,
      renderCell: (params) => (
        <div className={`tag tag-${params.row.active ? 'active' : 'block'}`}>
          {params.row.active ? 'Hoạt động' : 'Khóa'}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      flex: 1,
      align: 'center',
      renderCell: (params) =>
        <ActionButtons params={params}
          handleClickOpen={() => {
            setOpen(true)
            setSelectData(params.row)
          }}
          handleClickDelOpen={() => {
            setSelectData(params.row)
            setOpenDelete(true)
          }
          }
        />
    },
  ];

  const watchProvince = watch('province', '');
  const watchDistrict = watch('district', '');

  // const getDetail = async (id) => {
  //   const { accessToken } = await getAuthToken();
  //   if (selectData && accessToken) {
  //     if (selectData.id) {
  //       try {
  //         const res = await get(`/customer/${selectData.id}`, {
  //           headers: {
  //             Authorization: `Token ${accessToken}`,
  //           }
  //         })
  //         if (res) {

  //           reset((value) => ({
  //             ...value,
  //             ...selectData,
  //             Ten: res.ten
  //           }));
  //           setValue('province', res.province.id);
  //           setValue('ngaySinh', res.ngaySinh);
  //           console.log(res.ngaySinh, 'ngaySinh');
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }
  // };

  const handleDele = async () => {
    const { accessToken } = await getAuthToken();
    if (selectData && accessToken) {
      if (selectData.id) {
        try {
          const res = await Delete(`/customer/${selectData.id}/delete`, {
            headers: {
              Authorization: `Token ${accessToken}`,
            }
          })
          if (res) {
            enqueueSnackbar('Xoá thành công', { variant: 'error' });
            getList()
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset(defaultValues)
    setSelectData({})
  };

  const getProvince = async () => {
    try {
      const res = await get('province')
      if (res) {
        setProvince(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadDistrict = async () => {
      try {
        const req = await get(`/district/${watchProvince}`);
        if (req) {
          setDistrict(req);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (watchProvince) {
      loadDistrict();
    }
    return () => { };
  }, [watchProvince]);

  useEffect(() => {
    const loadWard = async () => {
      try {
        const req = await get(`/ward/${watchDistrict}`);
        if (req) {
          setWard(req);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (watchDistrict) {
      loadWard();
    }
    return () => { };
  }, [watchDistrict]);

  const onSubmit = async (data) => {
    try {
      console.log(data, "data");
      const date = startDate?.$d.toLocaleDateString('en-CA');
      const fromData = {
        hoTenLot: data.hoTenLot,
        Ten: data.Ten ?? '',
        email: data.email ?? 0,
        username: data.username ?? '',
        soDienThoai: data.soDienThoai ?? '',
        province: data.province ?? '',
        district: data.district ?? '',
        ward: data.ward ?? '',
        diaChi: data.diaChi ?? '',
        ngaySinh: date ?? '',
        password: data.password ?? '',
      };
      const res = await post('/customer/register', fromData);
      if (res) {
        enqueueSnackbar('Thêm thành công', { variant: 'success' });
        handleClose()
        reset(defaultValues)
      }
    } catch (error) {
      enqueueSnackbar('Thêm thất bại', { variant: 'error' });
    }
  };

  const getList = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('customer', {
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

  useEffect(() => {
    getList()
    getProvince()
    setSelectData({})
  }, [])

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setSelectData({});
  };

  const handleDelete = async () => {
    try {
      const { accessToken } = await getAuthToken();
      if (accessToken && selectData) {
        // call api delete
        const res = await Delete(`sanpham/${selectData.id}`, {
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


  useEffect(() => {
    if (selectData) {
      reset((value) => ({
        ...value,
        ...selectData,
        Ten: selectData.ten
      }));
      setStartDate(dayjs(selectData?.ngaySinh))
    }
  }, [selectData])

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
        <SearchTable>
          <TextField name="ten" label="Tên người dùng" />
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
              rowHeight={100}
            />
          </div>
        </Stack>
      </Container>
      <FormDialogSubmit open={open} title={`${selectData?.id ? 'Cập nhật' : 'Thêm mới'} nhà người dùng`}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6}>
              <TextField
                type="text"
                label="Họ và tên lót"
                name="hoTenLot"
                {...register('hoTenLot', { required: 'Nhập Họ và tên lót' })}
                fullWidth
                error={!!errors.hoTenLot}
                helperText={errors.hoTenLot?.message}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                name="Ten"
                {...register('Ten', { required: 'Nhập tên' })}
                fullWidth
                error={!!errors.Ten}
                helperText={errors.Ten?.message}
                label="Ten"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                {...register('email', { required: 'Nhập tên' })}
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            {!selectData?.id && <Grid item xs={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                {...register('password', { required: 'Nhập password' })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>}
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="username"
                label="Username"
                type="text"
                {...register('username', { required: 'Nhập username' })}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <DatePicker
                name='ngaySinh'
                onChange={date => {
                  console.log(date, "date")
                  setStartDate(date)
                }}
                format="DD/MM/YYYY"
                inputFormat="DD/MM/YYYY"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                name="soDienThoai"
                label="SDT"
                type="number"
                autoComplete="new-password"
                {...register('soDienThoai', { required: 'Nhập SDT' })}
                error={!!errors.soDienThoai}
                helperText={errors.soDienThoai?.message}
              />
            </Grid>
            {!selectData?.id && <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  select
                  fullWidth
                  name="province"
                  label="Thành phố / Tỉnh"
                  inputProps={register('province', {
                    required: 'Nhap Thành phố / Tỉnh!',
                  })}
                  error={errors.province}
                  helperText={errors.province?.message}
                >
                  {province && province?.map(({ id, name, code }) => {
                    return (
                      <MenuItem value={id} key={id}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </FormControl>
            </Grid>}
            {!selectData?.id && <Grid item xs={6}>
              <TextField
                select
                fullWidth
                name="district"
                label="Quận / Huyện"
                inputProps={register('district', {
                  required: 'Nhap Quận / Huyện!',
                })}
                error={errors.district}
                helperText={errors.district?.message}
              >
                {district &&
                  district?.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </Grid>}
            {!selectData?.id && <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  select
                  fullWidth
                  name="ward"
                  label="Phường"
                  inputProps={register('ward', {
                    required: 'Nhap Phường!',
                  })}
                  error={errors.ward}
                  helperText={errors.ward?.message}
                >
                  {ward &&
                    ward?.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                </TextField>
              </FormControl>
            </Grid>}
            <Grid item xs={12}>
              <TextField
                name="diaChi"
                {...register('diaChi', { required: 'Nhập Địa chỉ' })}
                label="Địa chỉ"
                fullWidth
                error={!!errors.diaChi}
                helperText={errors.diaChi?.message}
              />
            </Grid>
          </Grid>
          <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
            <Button onClick={handleClose}>Đóng</Button>
            <Button type="submit">Hoàn tất</Button>
          </div>
        </Box>
      </FormDialogSubmit>
      <FormDialog
        open={openDelete}
        title="Bạn có chắc chắn muốn khóa không ?"
        ok="Khóa"
        close="Đóng"
        handleClickOpen={() => { }}
        handleClose={handleDeleteClose}
        handleSubmit={handleDelete}
      >
        <Box component="form" noValidate autoComplete="off" style={{ marginTop: '10px' }}>
          <></>
        </Box>
      </FormDialog>
    </>
  )
}