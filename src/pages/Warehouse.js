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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { DataGrid } from '@mui/x-data-grid';
import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';
import { Delete, get, getAuthToken, post, put } from '../services/request/request-service';
import ActionButtons from '../components/action-button/ActionButtons';
import FormDialogSubmit from '../components/formDialog/FormDialogSubmit';
import { enumData } from '../constant/enumData';
import SearchTable from '../components/search/SeachTable';

// ----------------------------------------------------------------------

const Warehouse = () => {
  const [open, setOpen] = useState(false);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataNSX, setDataNSX] = useState([]);
  const [dataProductNSX, setDataProductNSX] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectData, setSelectData] = useState({});

  const {
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nhasanxuat: '',
      diaChi: '',
      email: '',
      soDienThoai: '',
      sanphamNSX: ''
    },
  });
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    // { field: 'tongTien', headerName: 'Tổng tiền', width: 180 },
    // // { field: 'createDate', headerName: 'Ngày nhập', width: 200 },
    // {
    //   field: 'createDate',
    //   headerName: 'Ngày nhập',
    //   width: 200,
    //   renderCell: (params) => (
    //     <div>{new Date(params.row.createDate).toLocaleDateString('en-GB')}</div>
    //   ),
    // },    
    { field: 'nhasanxuat', headerName: 'Tên nhà cung câp', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'diaChi', headerName: 'Địa chỉ', width: 210 },
    {
      field: 'soDienThoai',
      headerName: 'Số điện thoại',
      type: 'number',
      minWidth: 160,
      align: 'center',
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

  const columnPhieuNhap = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nhasanxuat', headerName: 'Tên nhà cung câp', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'diaChi', headerName: 'Địa chỉ', width: 210 },
    {
      field: 'soDienThoai',
      headerName: 'Số điện thoại',
      type: 'number',
      minWidth: 160,
      align: 'center',
    },
  ]


  const watchProducer = watch('nhasanxuat', '')
  const watchsanphamNSX = watch('sanphamNSX', '')

  useEffect(() => {
    getList();
    getListNhasanxuat()
  }, []);

  const getListNhasanxuat = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('nhasanxuat', {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res?.status === 'OK') {
          const result = res?.data.map((item) => ({ value: item.id, label: item.tenNhaSanXuat }))
          if (result) {
            setDataNSX(result)
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const getList = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('phieunhaphang', {
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

  const handleClose = () => {
    setOpen(false);
    setSelectData('');
    reset({
      nhasanxuat: '',
      diaChi: '',
      email: '',
      soDienThoai: '',
    });
  };

  const onSubmit = async (data) => {
    console.log(selectData, 'selectData');
    if (!selectData && !selectData?.id) {
      // truong hop nay la không có seledata nghĩa là mình chưa chọn thằng nào nên n hiểu là taọ mơis
      try {
        if (data) {
          const { accessToken } = await getAuthToken();
          if (accessToken) {
            const res = await post('phieunhaphang', data, {
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

      // ngược lại nếu đẫ chọn 1 thằng rồi thì la cap nhật
      try {
        if (data) {
          const { accessToken } = await getAuthToken();
          if (accessToken) {
            const res = await put(`phieunhaphang/${selectData.id}`, data, {
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

  const handleDelete = async () => {
    try {
      const { accessToken } = await getAuthToken();
      if (accessToken && selectData) {
        // api delete
        const res = await Delete(`phieunhaphang/${selectData.id}`, {
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
  const handleDeleteClose = () => {
    setOpenDelete(false);
    setSelectData('');
  };

  const getListProduct = async (name) => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get(`/sanpham/nhasanxuat/${name}`, {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res?.status === 'OK') {
          const arrResult = res?.data.map((item) => (
            {
              value: item.id,
              label: item.tenSanPham,
              ...item,
            }
          ))
          setDataProductNSX(arrResult)
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (watchProducer) {
      const producerName = dataNSX?.find((item) => item.value === watchProducer)?.label
      console.log(producerName, 'producerName');
      if (producerName) {
        getListProduct(producerName)
      }
    }
  }, [watchProducer])

  useEffect(() => {
    if (watchsanphamNSX) {
      const sanpham = dataProductNSX?.find((item) => item.id === watchsanphamNSX)
      if (sanpham) {
        let soLoai = 0
        sanpham?.thuocTinhs.forEach((item) => {
          if (item.loai) {
            soLoai = item.loai
          }
        })

        const arrThuocTinh = []

        if (soLoai > 0) {
          // eslint-disable-next-line no-plusplus
          for (let index = 1; index <= soLoai; index++) {
            const arr = sanpham?.thuocTinhs.filter((item) => item.loai === index)
            const arrTotal = {}
            if (arr) {
              arr?.forEach((item) => {
                arrTotal[`${item.tenThuocTinh}`] = item.giaTriThuocTinh
              })
            }
            arrThuocTinh.push(arrTotal)
          }
        }

        console.log(arrThuocTinh, 'arrThuocTinh');
      }
    }
  }, [watchsanphamNSX])


  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Phiếu nhập kho
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setOpen(true);
            }}
          >
            Thêm nhà sản xuất
          </Button>
        </Stack>
        <SearchTable>
          <TextField name="nhasanxuat" label="Tên nhà cung cấp" />
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
        <FormDialogSubmit size='lg' open={open} title={`${selectData?.id ? 'Cập nhật' : 'Thêm mới'} phiếu`}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ paddingTop: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    select
                    fullWidth
                    name="nhasanxuat"
                    label="Tên nhà cung cấp"
                    inputProps={register('nhasanxuat', {
                      required: 'Nhập tên nhà cung cấp!',
                    })}
                    error={errors.nhasanxuat}
                    helperText={errors.nhasanxuat?.message}
                  >
                    {dataNSX && dataNSX?.map((item) => {
                      return (
                        <MenuItem value={item.value} key={item.value}>
                          {item.label}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={[]}
                    columns={columnPhieuNhap}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                    }}
                    pageSizeOptions={[5]}
                    hideFooter
                    disableRowSelectionOnClick
                  />
                </Box>
                <Button onClick={() => { setOpenAddItem(!openAddItem) }}>Thêm sản phẩm</Button>
              </Grid>
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
              <Button onClick={handleClose}>Đóng</Button>
              <Button type="submit">Hoàn tất</Button>
            </div>
          </form>
        </FormDialogSubmit>
        <Dialog
          fullWidth='lg'
          open={openAddItem}
          onClose={handleClose}
          title={`${true ? 'Cập nhật' : 'Thêm mới'} sản phẩm`}
        >
          <DialogTitle id="alert-dialog-title">
            {"Thêm sản phẩm vào phiếu nhập"}
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    select
                    fullWidth
                    name="sanphamNSX"
                    label="Thêm sản phẩm nhập"
                    inputProps={register('sanphamNSX', {
                      required: 'Nhập tên nhà cung cấp!',
                    })}
                    error={errors.sanphamNSX}
                    helperText={errors.sanphamNSX?.message}
                  >
                    {dataProductNSX && dataProductNSX?.map((item) => {
                      return (
                        <MenuItem value={item.value} key={item.value}>
                          {item.label}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </FormControl>

              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="giaSanPham"
                  {...register('giaSanPham', { required: 'Nhập so giá sản phẩm' })}
                  fullWidth
                  error={!!errors.giaSanPham}
                  helperText={errors.giaSanPham?.message}
                  label="Giá sản phẩm"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="soLuong"
                  {...register('soLuong', { required: 'Nhập so Luong' })}
                  fullWidth
                  error={!!errors.soLuong}
                  helperText={errors.soLuong?.message}
                  label="Số lượng"
                />
              </Grid>
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
              <Button onClick={() => { setOpenAddItem(false) }}>Đóng</Button>
              <Button type="submit">Hoàn tất</Button>
            </div>
          </form>
        </Dialog>
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
      </Container >
    </>
  ); // thiếu form thêm, xóa cần được hiện ra
}
export default Warehouse
