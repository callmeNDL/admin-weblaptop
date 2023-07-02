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
import { Delete, get, getAuthToken } from '../services/request/request-service';
import ActionButtons from '../components/action-button/ActionButtons';
import SearchTable from '../components/search/SeachTable';
import FormDialogSubmit from '../components/formDialog/FormDialogSubmit';
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
  const [file, setFile] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectData, setSelectData] = useState([]);
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

  useEffect(() => {
    getList()
  }, [])

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

  useEffect(() => {
    getList();
  }, []);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Danh sách hóa đơn
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => {
            setOpen(true);
          }}
        >
          Thêm hóa đơn
        </Button>
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
        open={open}
        title="Thêm mới hóa đơn"
      >
        
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField id="name" label="Tên khách hàng" multiline fullWidth />
              {/* rows={2} */}
            </Grid>
            <Grid item xs={6}>
              <TextField id="diaChi" label="Địa chỉ" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id="soDienThoai" label="Số điện thoại" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id="ghiChu" label="Ghi chú" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id="trangThaiThanhToan" label="Thanh toán" fullWidth />
            </Grid>

            <Grid item xs={6}>
              <TextField id="soTienTraGop" label="Sô tiền trả góp" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id="soTienTraTruoc" label="Số tiền trả trước" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id="soTienTraGop" label="Số tiền trả góp" fullWidth />
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
    </Container>
  );
}