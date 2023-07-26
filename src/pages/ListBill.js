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
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';

import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';
import { Delete, get, getAuthToken, put } from '../services/request/request-service';
import ActionButtons from '../components/action-button/ActionButtons';
import SearchTable from '../components/search/SeachTable';
import FormDialogSubmit from '../components/formDialog/FormDialogSubmit';
import { enumData } from '../constant/enumData';
// ----------------------------------------------------------------------
const defaultValues = {
  tenKhachHang: '',
  diaChi: "",
  soDienThoai: "",
  ghiChu: "",
  trangThaiThanhToan: "",
  soThangTraGop: '',
  soTienTraTruoc: null,
  soTienTraGop: null,
  chiTietHoaDons: [{
    soLuong: '',
    gia: null,
    sanPham: {
      id: ''
    }
  }]
};

export default function ListBill() {
  const [open, setOpen] = useState(false);
  const [showDetailBill, setShowDetailBill] = useState(false);
  const [showDetailBillStatus, setShowDetailBillStatus] = useState(false);

  const [file, setFile] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectData, setSelectData] = useState([]);
  const [selectDataSP, setSelectDataSP] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);

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

  const handleOnChangeUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'tenKhachHang', headerName: 'Tên khách hàng', width: 180 },
    {
      field: 'description', headerName: 'Chi tiết hóa đơn', width: 300,
      renderCell: (params) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          className='detailAction'
          onClick={() => {
            setSelectData(params.row)
            setShowDetailBill(true)
          }}
        >
          Xem danh sách sản phẩm
        </div>
      )

    },
    { field: 'diaChi', headerName: 'Địa chỉ', width: 110 },
    { field: 'isTraGop', headerName: 'Trả góp', width: 110 },
    {
      field: 'tongTien',
      headerName: 'Tổng tiền',
      type: 'number',
      minWidth: 160,
      align: 'center',
    },
    {
      field: 'trangThai',
      headerName: 'Trạng thái',
      sortable: false,
      minWidth: 100,
      align: 'center',
      renderCell: (params) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          className='detailAction'
          onClick={() => {
            setSelectData(params.row)
            setShowDetailBillStatus(true)
          }}
        >
         {enumData.statusBill[params?.row?.trangThai]?.value}
        </div>
      )
    },
    {
      field: 'ghiChu',
      headerName: 'Ghi chú',
      sortable: false,
      minWidth: 100,
      align: 'center',
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

  const columnPhieuNhap = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'tenSanPham', headerName: 'Sản phẩm', width: 250 },
    { field: 'option', headerName: 'Option', width: 300 },
    { field: 'soLuong', headerName: 'Số lượng', width: 100 },
    {
      field: 'gia',
      headerName: 'Giá',
      minWidth: 120,
      align: 'center',
    },
  ]

  useEffect(() => {
    getList()
  }, [])

  const handleClickOpen = () => {
    setShowDetailBill(false);
  };
  const handleClose = () => {
    setShowDetailBillStatus(false)
    setShowDetailBill(false);
  };
  const handleOnChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const getList = async () => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get('hoadon', {
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
  const handleOnChangeStatus = async () => {
    try {
      const { accessToken } = await getAuthToken();
      if (accessToken && selectData) {
        // call api delete
        let status = 0
         if(selectData?.trangThai === 1 ){
          status = 'chuanbihang'
        }else if (selectData?.trangThai === 2 ) {
          status = 'giaohang'
        }
        else if (selectData?.trangThai === 3 ) {
          status = 'thanhcong'
        }
        else if (selectData?.trangThai === 4 ) {
          status = 'xoa'
        }
        const res = await  put(`hoadon/${selectData.id}/${status}`,null, {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res?.status === 'OK') {
          getList();
          enqueueSnackbar(res?.message, { variant: 'success' });
          handleClose();
        } else {
          enqueueSnackbar('Khóa thất bại', { variant: 'error' });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (selectData) {
      reset((value) => ({
        ...value,
        ...selectData,
      }));
      if(!!selectData?.chiTietHoaDons && selectData?.chiTietHoaDons?.length){
        let dataSanPham = []
        dataSanPham = selectData?.chiTietHoaDons.map((item) => {
          let optionSP = ""

          item?.sanPham?.thuocTinhs?.forEach((a,index) => {
            optionSP = `${optionSP} ${index !== 0 ? '/' : ""} ${a.giaTriThuocTinh}`
          })
          
          // item?.sanPham?.thuocTinhs
          return {
            gia : item?.gia ?? '',
            id: item?.id ?? '',
            tenSanPham: item?.sanPham?.tenSanPham ?? "",
            soLuong: item?.soLuong ?? "",
            option : optionSP
          }
        })
      setSelectDataSP(dataSanPham)

      }
      
    }
  }, [selectData])

  console.log(selectData, "selectData");

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Danh sách hóa đơn
        </Typography>
        {/* <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => {
            setOpen(true);
          }}
        >
          Thêm hóa đơn
        </Button> */}
      </Stack>
      <SearchTable>
        <TextField name="tenKhachHang" label="Tên khách hàng" />
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
      <FormDialogSubmit
        open={showDetailBill}
        title="Thêm mới hóa đơn"
        size='lg'
      >
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ marginTop: '20px' }}>
              <TextField
                type="text"
                label="Tên khách hàng"
                name="tenKhachHang"
                {...register('tenKhachHang', { required: 'Nhập Tên khách hàng' })}
                fullWidth
                error={!!errors.tenKhachHang}
                helperText={errors.tenKhachHang?.message}
              />
              {/* rows={2} */}
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="text"
                label="Dịa chỉ"
                name="diaChi"
                {...register('diaChi', { required: 'Nhập Dịa chỉ' })}
                fullWidth
                error={!!errors.diaChi}
                helperText={errors.diaChi?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField id="soDienThoai" type="text"
                name="soDienThoai"
                {...register('soDienThoai', { required: 'Nhập Dịa chỉ' })}
                fullWidth
                error={!!errors.soDienThoai}
                helperText={errors.soDienThoai?.message}
                label="Số điện thoại" />
            </Grid>
            <Grid item xs={6}>
              <TextField id="soTienTraTruoc" label="Số tiền trả trước" name="soTienTraTruoc"
                {...register('soTienTraTruoc', { required: 'Số tiền trả trước' })}
                fullWidth
                error={!!errors.soTienTraTruoc}
                helperText={errors.soTienTraTruoc?.message} />
            </Grid>

            <Grid item xs={6}>
              <TextField id="tongTien" label="Tổng tiền" name="soTienTraTruoc"
                {...register('tongTien', { required: 'Số tiền trả trước' })}
                fullWidth
                error={!!errors.tongTien}
                helperText={errors.tongTien?.message} />
            </Grid>
            <Grid item xs={12} style={{ position: 'relative' }}>
              <Typography> Danh sách sản phẩm</Typography>
                <Box sx={{ height: 300, width: '100%', paddingBottom: '50px' }}>
                  <DataGrid
                    rows={selectDataSP}
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
              </Grid>

          </Grid>
          <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
            <Button onClick={handleClose}>Đóng</Button>
            {/* <Button type="submit">Hoàn tất</Button> */}
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
      <FormDialog
        open={showDetailBillStatus}
        title="Chuyển trạng thái ?"
        ok="Lưu"
        close="Đóng"
        handleClickOpen={() => { }}
        handleClose={()=>{setShowDetailBillStatus(false)}}
        handleSubmit={handleOnChangeStatus}
      >
        <Box component="form" noValidate autoComplete="off" style={{ marginTop: '10px' }}>
          <>
          {enumData?.statusBill[Number(selectData?.trangThai) + 1]?.value}
          </>
        </Box>
      </FormDialog>
    </Container>
  );
}