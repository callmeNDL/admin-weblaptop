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
import { useForm } from 'react-hook-form';
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
  const [dataListSP, setDataListSP] = useState([]);
  const [dataNSX, setDataNSX] = useState([]);
  const [dataNCC, setDataNCC] = useState([]);
  const [dataProductNSX, setDataProductNSX] = useState([]);
  const [dataThuocTinh, setDataThuocTinh] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectData, setSelectData] = useState({});

  const {
    register,
    reset,
    watch,
    setValue,
    getValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nhasanxuat: '',
      tongTien: '',
      chiTietPhieuNhapHang: [],
    },
  });

  const {
    register: register2,
    watch: watch2,
    reset: reset2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm({
    defaultValues: {
      id: '',
      giaSanPham: '',
      soLuong: "",
      loai: '',
      sanphamNSX: '',
      tongTien: '',
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
    { field: 'nhasanxuat', headerName: 'Tên nhà cung câp', width: 180, renderCell: (params)=>(
      <div>
        {params.row.nhaCungCap?.tenNhaCungCap}
      </div>
    ),
   },
    // { field: 'email', headerName: 'Nhà xản xuất', width: 200 },
    { field: 'tongTien', headerName: 'Tổng tiền', width: 140 },
    {
      field: 'createDate',
      headerName: 'Ngày tạo',
      type: 'number',
      minWidth: 90,
      align: 'center',
      renderCell: (params) => (
        <div>{new Date(params.row.createDate).toLocaleDateString('en-GB')}</div>
      ),
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
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'sanphamNSX', headerName: 'Sản phẩm', width: 180 },
    { field: 'loai', headerName: 'Option', width: 200 },
    { field: 'soLuong', headerName: 'Số lượng', width: 100 },
    {
      field: 'giaSanPham',
      headerName: 'Giá',
      minWidth: 120,
      align: 'center',
    },
  ]

  const watchProducer = watch('nhasanxuat', '')
  const watchsanphamNSX = watch2('sanphamNSX', '')

  useEffect(() => {
    getList();
    getListNhasanxuat()
    getListNCC();
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

  const getListNCC = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('nhacungcap', {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res?.status === 'OK') {
          const result = res?.data.map((item) => ({ value: item.id, label: item.tenNhaCungCap }))
          if (result) {
            setDataNCC(result)
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

  const handleClose2 = () => {
    setOpenAddItem(false)
    reset2({ giaSanPham: '', soLuong: "", loai: '', sanphamNSX: '', })

  }
  const onSubmit = async (data) => {
    try {
      console.log(data, 'selectData');
      let arrChiTietPhieuNhapHang = []

      if (dataListSP?.length > 0) {
        arrChiTietPhieuNhapHang = dataListSP.map((item) => ({
          giaNhap: item.giaSanPham,
          soLuong: item.soLuong,
          sanPham: {
            id: item.id
          }
        }))
      }

      console.log(arrChiTietPhieuNhapHang, 'arrChiTietPhieuNhapHang');

      const fromData = {
        nhaCungCap: data?.nhaCungCap ?? 0,
        tongTien: data?.tongTien ?? 0,
        nhaSanXuat: data?.nhasanxuat,
        chiTietPhieuNhapHang: arrChiTietPhieuNhapHang
      }

      if (data) {
        const { accessToken } = await getAuthToken();
        if (accessToken) {
          const res = await post('phieunhaphang', fromData, {
            headers: {
              Authorization: `Token ${accessToken}`,
            },
          });
          console.log(res, "check ress");
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
  };

  const onSubmit2 = async (data) => {
    setDataListSP((dataListSP) => [
      {
        ...data,
        sanphamNSX: dataProductNSX?.find((item) => item.id === data.sanphamNSX)?.tenSanPham ?? '',
        id: data?.sanphamNSX
      },
      ...dataListSP])
    handleClose2()
  }

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
            console.log(sanpham?.thuocTinhs, 'sanpham?.thuocTinhs');
            const arrTotal = {}
            if (arr) {
              arr?.forEach((item, index) => {
                arrTotal[`${item.tenThuocTinh}`] = `${item.giaTriThuocTinh} ${index === arr?.length - 1 ? '' : "/"}`
              })

            }
            arrThuocTinh.push(arrTotal)
          }
        }
        setDataThuocTinh(arrThuocTinh)
      }
    }
  }, [watchsanphamNSX])

  useEffect(() => {
    if (dataListSP.length > 0) {
      let sum = 0
      dataListSP.forEach((item) => { sum += (Number(item?.giaSanPham) * Number(item?.soLuong)) })
      if (sum !== 0) {
        setValue('tongTien', sum)
      }
    } else {
      setValue('tongTien', 0)
    }
  }, [dataListSP])

  useEffect(() => {
    getList();
  }, [])
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
            Thêm mới
          </Button>
        </Stack>
        <SearchTable>
          <TextField name="nhasanxuat" label="Tên nhà cung cấp" />
        </SearchTable>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <div style={{ minHeight: 200, width: '100%' }}>
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
                    name="nhaCungCap"
                    label="Tên nhà cung cấp"
                    inputProps={register('nhaCungCap', {
                      required: 'Chọn nha cung cấp!',
                    })}
                    error={errors.nhaCungCap}
                    helperText={errors.nhaCungCap?.message}

                  >
                    {dataNCC && dataNCC?.map((item) => {
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
                <FormControl fullWidth>
                  <TextField
                    select
                    fullWidth
                    name="nhasanxuat"
                    label="Tên nhà san xuat"
                    inputProps={register('nhasanxuat', {
                      required: 'Nhập tên nhà san xuat!',
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
              <Grid item xs={12} style={{ position: 'relative' }}>
                <Box sx={{ height: 300, width: '100%', paddingBottom: '50px' }}>
                  <DataGrid
                    rows={dataListSP}
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
                <Button onClick={() => { setOpenAddItem(!openAddItem) }} style={{ position: 'absolute', top: 25, right: 0 }}>Thêm sản phẩm</Button>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <TextField
                    name="tongTien"
                    {...register('tongTien', { required: 'Tổng tiền' })}
                    fullWidth
                    error={!!errors.tongTien}
                    helperText={errors.tongTien?.message}
                    label="Tổng tiền"
                  />
                </Grid>
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
          <form onSubmit={handleSubmit2(onSubmit2)} style={{ padding: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    select
                    fullWidth
                    name="sanphamNSX"
                    label="Thêm sản phẩm nhập"
                    inputProps={register2('sanphamNSX', {
                      required: 'Nhập tên nhà cung cấp!',
                    })}
                    error={errors2.sanphamNSX}
                    helperText={errors2.sanphamNSX?.message}
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
                <FormControl fullWidth>
                  <TextField
                    select
                    fullWidth
                    name="loai"
                    label="Chọn cấu hình"
                    inputProps={register2('loai', {
                      required: 'Nhập tên nhà cung cấp!',
                    })}
                    error={errors2.loai}
                    helperText={errors2.loai?.message}
                  >
                    {dataThuocTinh && dataThuocTinh?.map((item, index) => {
                      return (
                        <MenuItem value={Object.values(item)} key={index}>
                          {Object.values(item)}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="giaSanPham"
                  {...register2('giaSanPham', { required: 'Nhập so giá sản phẩm' })}
                  fullWidth
                  error={!!errors2.giaSanPham}
                  helperText={errors2.giaSanPham?.message}
                  label="Giá sản phẩm"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="soLuong"
                  {...register2('soLuong', { required: 'Nhập so Luong' })}
                  fullWidth
                  error={!!errors2.soLuong}
                  helperText={errors2.soLuong?.message}
                  label="Số lượng"
                />
              </Grid>
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
              <Button onClick={handleClose2}>Đóng</Button>
              <Button type="submit">Hoàn tất</Button>
            </div>
          </form>
        </Dialog>
        <FormDialog
          open={openDelete}
          title="Bạn có chắc chắn muốn khóa không?"
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
