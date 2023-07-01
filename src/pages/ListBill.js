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
import Iconify from '../components/iconify';
import FormDialog from '../components/formDialog/FormDialog';
import { get, getAuthToken } from '../services/request/request-service';
import ActionButtons from '../components/action-button/ActionButtons';
// ----------------------------------------------------------------------


export default function ListBill() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
      
        const handleOnChangeUpload = (event) => {
          const file = event.target.files[0];
          setSelectedFile(file);
        };
    const columns = [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'userName', headerName: 'Tên khách hàng', width: 180 },
      // {
      //   field: 'description',
      //   headerName: 'Chi tiết hóa đơn',
      //   minWidth: 370,
      //   align: 'center',
      //   flex: 1,
      //   renderCell: (params) => (
      //     <div style={{ width: 450, display: 'flex', alignItems: 'center', whiteSpace: 'normal', gap: 10 }}>
      //       <img
      //         src={params.row && params.row?.hinhAnhs[0]?.path}
      //         alt="img-product-cart"
      //         style={{ width: '80px', height: '80px', objectFit: 'cover' }}
      //       />
      //       <div>
      //         <div>{params.row.name}</div>
      //       </div>
      //     </div>
      //   ),
      // },
      { field: 'description', headerName: 'Chi tiết hóa đơn', width: 300 },
      // { field: 'closeDate', headerName: 'Thời hạn', width: 110 },
      { field: 'address', headerName: 'Địa chỉ', width: 110 },
     
      {
        field: 'total',
        headerName: 'Tổng tiền',
        type: 'number',
        minWidth: 160,
        align: 'center',
      },
      {
        field: 'active  ',
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
            () => { },
            () => { }
          ),
      },
    ];
  
    const rows = [
      {
        id: 1,
        userName: 'Lê Hoàng Anh',
        description:'Chi tiết hóa đơn',
        address: '180 cao Lỗ, Phường 4, quận 8, TPHCM',
        active: true,
        total: '17.000.000vnd',
      },
      {
        id: 2,
        userName: 'Nguyễn Hoàng Minh',
        description:'Chi tiết hóa đơn',
        address: '159 Nguyễn Thị Minh Khai, phường Phạm Ngũ Lão, quận 1, TPHCM',
        active: true,
        total: '32.000.000vnd',
      },
      {
        id: 3,
        userName: 'Ngô Hồng Hải',
        description:'Chi tiết hóa đơn',
        address: '55B Trần Quang Khải, phường Tân Định, quận 1 TPHCM',
        active: true,
        total: '18.000.000vnd',
      },
      {
        id: 4,
        userName: 'Nguyễn Phúc Thành',
        description:'Chi tiết hóa đơn',
        address: '220 Trần Quang Khải, phường Tân Định, quận 1 TPHCM',
        active: true,
        total: '15.000.000vnd',
      },
    ]
  
    useEffect(() => {
      getList()
    }, [])
  
    const getList = async () => {
      const { accessToken } = await getAuthToken();
      if (accessToken) {
        try {
          const res = await get('sanpham', {
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
  
    return (
      <>
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
                rowHeight={100}
              />
            </div>
          </Stack>
          <FormDialog
            open={open}
            title="Thêm mới hóa đơn"
            ok="Thêm mới"
            close="Đóng"
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
          >
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField id="name" label="Tên khách hàng" multiline  fullWidth />
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
                
                <Grid item xs={12}>
                    <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span" style={{ height: '100%', width: 260 }}>
                        Upload File chi tiết hóa đơn.
                    </Button>
                    <input
                        accept=".xlsx, .xls"
                        id="raised-button-file"
                        multiple
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleOnChangeUpload}
                    />
                    </label>
                    {selectedFile && (
                    <p>Selected file: {selectedFile.name}</p>
                    )}
                </Grid>
              </Grid>
            </Box>
          </FormDialog>
        </Container>
      </>
    );
  }